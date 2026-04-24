#ifndef IOHANDLER_H
#define IOHANDLER_H

#include <string>

class IOHandler {
public:
    // destructor
    virtual ~IOHandler() = default;

    // print string to output source
    virtual void print(const std::string& s) = 0; 
    // get user input fro input source
    virtual void readInput() = 0;
    // extract commandType and args from input
    virtual void parser() = 0;  
};

#endif