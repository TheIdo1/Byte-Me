#include "include/App.h"
#include "include/SocketHandler.h"
#include "include/FileHandler.h"
#include "include/TcpServer.h"
#include "include/PlainTextFormatter.h"
#include <iostream>



// Main entry point for the Server application.
// The server expects exactly one command-line argument: the port number.
int main(int argc, char* argv[]) {

    // Verify that exactly one argument (the port) was provided.
    if (argc != 2) {
        // the contract said not printing other then specified, so this is a comment
        std::cerr << "Error: Missing or too many arguments. Usage: " << argv[0] << " <port>" << std::endl;
        exit(1);
    }

    std::string port_str = argv[1];

    // verify that the provided argument is strictly numeric.
    // We iterate through each character to ensure it's a digit.
    for (char const &c : port_str) {
        if (std::isdigit(c) == 0) {
            // the contract said not printing other then specified, so this is a comment
            std::cerr << "Error: Port argument must be a purely numeric value." << std::endl;
            exit(1);
        }
    }

    // Convert the validated string to an integer.
    int server_port = std::stoi(port_str);

    // Verify that the port is within the valid system range (1 to 65535).
    if (server_port < 1 || server_port > 65535) {
        // the contract said not printing other then specified, so this is a comment
        std::cerr << "Error: Port number must be between 1 and 65535." << std::endl;
        exit(1);
    }
    
    // --- Server Initialization ---
    
    // Initialize the DataHandler.
    // The FileHandler is responsible for loading from and saving to the local text files.
    FileHandler fileHandler;
    fileHandler.loadProducts();
    fileHandler.loadUsers();
    
    // Initialize and start the TCP Server with the validated port.
    TcpServer server(server_port);  // Instantiate the TcpServer to listen on given port
    server.start();                 // Performs socket(), bind(), and listen()
    
    while (true) {
        try {
            // Wait for a client to connect.
            // acceptClient() is a blocking call that returns the client's socket descriptor.
            int client_sock = server.acceptClient();


            // --- Setup the Application Components ---
            
            //Initialize the IOHandler
            // Instantiate the SocketHandler with the newly connected client.
            // This replaces the old Console IOHandler.
            SocketHandler socketHandler(client_sock);

            // Initialize the parser
            // parser is responsible of taking the rawInput and parse it to cmdType and args
            CommandParser parser;


            //Initialze Formatter 
            // The Formatter is responsible for formatting http request messages and their payloads (for example commands output).
            PlainTextFormatter PlainTextFormatter;

            // Instantiate the main Application via Dependency Injection.
            // We pass the socketHandler (by reference), the CommandParser, and the fileHandler (by reference).
            App app(socketHandler, parser, fileHandler, PlainTextFormatter);

            // Load initial data.
            // The setup method delegates the loading of products and users to the DataHandler,
            // which populates the ProductManager and UserManager.
            //app.setup();

            // Start the application.
            // This triggers the infinite loop that reads user input, parses it, and executes commands.
            app.run();
        } catch (const std::exception& e) {
            // Handle unexpected connection errors silently or log them

        }
        
        
    }
    

    return 0;
}