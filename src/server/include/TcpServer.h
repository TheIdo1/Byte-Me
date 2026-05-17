#ifndef TCPSERVER_H
#define TCPSERVER_H


// This class is responsible for creating the server socket (TCP based), binding it to a port,
// listening for incoming connections, and accepting a single client.
class TcpServer {
private:
    
    //The port number on which the server will listen.
    int port;

    
    // The file descriptor for the main listening socket.
    // This socket stays open to listen for new clients, but is NOT used to 
    // send or receive data from clients.
    int server_sock; 

    // constant defining the size of clients-waiting-room -the maximum number of pending connections queue
    //In targil2 it said to be 1
    static const int MAX_CONNECTED_CLIENTS = 1;

public:

    // Initializes the TcpServer with a specific port, but does not start it yet.
    TcpServer(int port);
    
    
    // Destructor
    ~TcpServer();


    // Starts the server.
    // Executes the standard socket(), bind(), and listen() sequence.
    // Throws a runtime_error if any of the underlying system calls fail.
    void start();


    // Waits for a client to connect.
    // This is a blocking call (the program pauses here) until a client arrives.
    // return The file descriptor (int) of the connected client (client_sock).
    int acceptClient();
};

#endif