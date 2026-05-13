#include <gtest/gtest.h>
#include "../src/server/include/SocketHandler.h"
#include <sys/socket.h>
#include <unistd.h>
#include <string>
#include <cstring>


/*
Preface to this file tests:
testing network sockets can be tricky because we usually need to open real ports, 
which can cause "Address already in use" errors and slow down the tests.
To solve this, we use the POSIX socketpair() function. It creates a pair of connected, 
unnamed sockets directly in the OS memory without involving the actual network stack (no IP/Ports).
- What we write to sv[0] can be read from sv[1].
- What we write to sv[1] can be read from sv[0].
In these tests:
sv[0] acts as the "Server side" (passed to our SocketHandler).
sv[1] acts as the "Client side" (used by the test itself to simulate a client).
*/ 



/*
brief Explanation of ::testing::Test (Google Test Fixture)
Inheriting from ::testing::Test creates a "Test Fixture". A fixture allows us to share 
a common setup and state across multiple independent tests. Google Test creates a fresh, 
new instance of this class for EVERY single test defined with TEST_F.
This ensures that tests do not interfere with each other.
*/
class SocketHandlerTest : public ::testing::Test {
protected:
    int sv[2]; // Array to hold the two connected file descriptors (sockets)
    SocketHandler* handler;

    /*
    This method runs automatically BEFORE each individual TEST_F.
    Connection to our tests: It creates a fresh socketpair and a new SocketHandler 
    instance so every test starts with a clean, perfectly working connection.
    */
    void SetUp() override {
        // Create the connected pair of sockets (AF_UNIX for local communication)
        if (socketpair(AF_UNIX, SOCK_STREAM, 0, sv) == -1) {
            FAIL() << "Failed to create socketpair for testing";
        }
        
        // Pass the "Server side" socket to our handler
        handler = new SocketHandler(sv[0]);
    }

    /*
    This method runs automatically AFTER each individual TEST_F finishes (whether it passes or fails).
    Connection to our tests: It prevents memory leaks by deleting the handler and 
    closes the "Client side" socket so the next test can start fresh.
    */
    void TearDown() override {
        delete handler; // This will also automatically close sv[0] via SocketHandler's destructor
        close(sv[1]);   // Close the mock client socket
    }
};

/**
Test 1: Verifies successful data reading from the client.
General Description: This test simulates a client sending a valid command to the server.
It checks that when the SocketHandler's readInput() method is called, 
it correctly reads the incoming bytes from the socket and converts them into a std::string.
*/
TEST_F(SocketHandlerTest, ReadInputReceivesDataSuccessfully) {
    std::string mock_client_msg = "add 1 101 102";
    
    // Simulate the client sending a message through its socket (sv[1])
    send(sv[1], mock_client_msg.c_str(), mock_client_msg.length(), 0);

    // The handler (Server side) reads the input from its socket (sv[0])
    std::string result = handler->readInput();
    
    // Assert that the handler read exactly what the client sent
    EXPECT_EQ(result, mock_client_msg);
}


/*
Test 2: Verifies successful data writing to the client.
This test simulates the server sending a response back to the client.
It checks that when the SocketHandler's print() method is called, 
the string is correctly sent over the socket and can be read exactly as it was by the client.
*/
TEST_F(SocketHandlerTest, PrintSendsDataToClient) {
    std::string server_response = "105 106 111";
    
    // The handler (Server side) sends a message using the print() method
    handler->print(server_response);

    // Simulate the client reading the message from its socket (sv[1])
    char buffer[1024];
    memset(buffer, 0, sizeof(buffer));
    int bytes_read = recv(sv[1], buffer, sizeof(buffer) - 1, 0);

    // Assert that data was actually received, and it matches what the server sent
    ASSERT_GT(bytes_read, 0) << "No data was received by the client";
    EXPECT_EQ(std::string(buffer), server_response);
}