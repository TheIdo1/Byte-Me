#include "include/App.h"
#include "include/SocketHandler.h"
#include "include/FileHandler.h"
#include "include/TcpServer.h"
#include <iostream>

int main() {

    //Setup the Network Server
    TcpServer server(5555); // Instantiate the TcpServer to listen on port 5555.
    server.start();         // Performs socket(), bind(), and listen()

    // wait for a client
    // The execution blocks here until a client connects
    // It returns the client's file descriptor (client_sock)
    int client_sock = server.acceptClient();

    // --- Initialize the IOHandler ---

    // Setup the Application Components
    // Instantiate the SocketHandler with the newly connected client.
    // This replaces the old Console IOHandler.
    SocketHandler socketHandler(client_sock);

    // Initialize the parser
    // parser is responsible of taking the rawInput and parse it to cmdType and args
    CommandParser parser;

    // Initialize the DataHandler.
    // The FileHandler is responsible for loading from and saving to the local text files.
    FileHandler fileHandler;

    // Instantiate the main Application via Dependency Injection.
    // We pass the socketHandler (by reference), the CommandParser, and the fileHandler (by pointer).
    App app(socketHandler, parser, &fileHandler);
    
    // Load initial data.
    // The setup method delegates the loading of products and users to the DataHandler,
    // which populates the ProductManager and UserManager.
    app.setup();

    // Start the application.
    // This triggers the infinite loop that reads user input, parses it, and executes commands.
    app.run();

    return 0;
}