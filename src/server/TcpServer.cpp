#include "include/TcpServer.h"

// Networking libraries for POSIX systems (Linux/Mac)
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <string.h>
#include <iostream>
#include <stdexcept>

// Initialize port and set server_sock to -1 (indicating it's not opened yet)
TcpServer::TcpServer(int port) : port(port), server_sock(-1) {}

TcpServer::~TcpServer() {

    // If the socket was successfully created, close it upon destruction
    if (server_sock >= 0) {
        close(server_sock);
    }
}

void TcpServer::start() {
    // Create a TCP socket using SOCK_STREAM (IPv4)
    server_sock = socket(AF_INET, SOCK_STREAM, 0);
    if (server_sock < 0) {
        throw std::runtime_error("Error creating listening socket");
    }

    // Initialize and configure the server address structure
    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin)); // Zero out the structure
    sin.sin_family = AF_INET;     // IPv4 address family
    sin.sin_addr.s_addr = INADDR_ANY; // Listen on all available network interfaces
    sin.sin_port = htons(port);       // Convert port number to network byte order

    // Bind the socket to the defined address and port
    if (bind(server_sock, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        throw std::runtime_error("Error binding socket");
    }

    // Set the socket to listening mode to wait for incoming connections
    // The number 'MAX_CONNECTED_CLIENTS' is the backlog - the maximum number of pending connections queue.
    if (listen(server_sock, MAX_CONNECTED_CLIENTS) < 0) {
        throw std::runtime_error("Error listening on socket");
    }

}

int TcpServer::acceptClient() {
    struct sockaddr_in client_sin;
    unsigned int addr_len = sizeof(client_sin);
    
    // Wait for a client to connect. 
    // The program pauses here. When a client connects, it returns a new socket dedicated to that client.
    int client_sock = accept(server_sock, (struct sockaddr *) &client_sin, &addr_len);

    if (client_sock < 0) {
        throw std::runtime_error("Error accepting client");
    }
    
    
    // Return the specific client's file descriptor so the App can talk to them
    return client_sock;
}