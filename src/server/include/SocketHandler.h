#ifndef SOCKETHANDLER_H
#define SOCKETHANDLER_H

#include "IOHandler.h"
#include <string>
#include <vector>

class SocketHandler : public IOHandler {
private:

    //  int client_sock is file descriptor for the specific client connection.
    //  This integer is an unique identifier (handle) provided by the 
    //  operating system after a successful 'accept' call. 
    int client_sock;                

public:
    // get the client_sock that achieved fro the main by accept
    SocketHandler(int client_sock);
    
    // destructor 
    virtual ~SocketHandler();

    void print(const std::string& s) override;
    std::string readInput() override;

};

#endif