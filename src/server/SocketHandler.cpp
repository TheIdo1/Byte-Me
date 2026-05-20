#include "include/SocketHandler.h" 
#include <sys/socket.h>            // Provides POSIX socket API functions like recv() and send().
#include <unistd.h>                // Provides access to the POSIX operating system API, specifically the close() function.
#include <sstream>
#include <iostream>
#include <string.h>


// initializes the SocketHandler with a specific client's file descriptor.
SocketHandler::SocketHandler(int client_sock) : client_sock(client_sock) {}


// Automatically called when the SocketHandler object is destroyed.
// It ensures that the network connection is gracefully closed to prevent resource leaks.
 SocketHandler::~SocketHandler() {

    // Closes the file descriptor associated with this client's socket.
    close(client_sock); 
}

// Reads incoming data from the client over the TCP socket.
std::string SocketHandler::readInput() {

    // declares a buffer to hold the incoming data.
    char buffer[4096]; 
    
    // Fills the buffer with null characters ('\0') to ensure no garbage data is left from previous memory usage.
    memset(buffer, 0, sizeof(buffer)); 
    
    // Reads data from the socket.
    // client_sock: the client's file descriptor.
    // buffer: where the data will be stored.
    // sizeof(buffer) - 1: maximum bytes to read (leaving 1 byte for the null terminator).
    // 0: default flags.
    // Returns the number of bytes successfully read.
    int read_bytes = recv(client_sock, buffer, sizeof(buffer) - 1, 0);
    
    if (read_bytes > 0) {
        // If data was received, convert the C-style character buffer into a C++ std::string.
        return std::string(buffer);
    } else {
        // If read_bytes is 0, the client disconnected gracefully.
        // If read_bytes < 0, a network error occurred.
        // In both cases, the connection is dead, so we throw an exception to notify the App.
        throw std::runtime_error("Client disconnected or network error occurred.");
    }
}

// Sends a string message back to the client. s The string to be sent.
void SocketHandler::print(const std::string& s) {

    // Sends the string over the TCP socket.
    // s.c_str(): gets a pointer to the underlying C-style string (character array).
    // s.length(): the number of bytes to send.
    // 0: default flags.
    send(client_sock, s.c_str(), s.length(), 0);
}
