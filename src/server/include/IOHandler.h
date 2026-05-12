#ifndef IOHANDLER_H
#define IOHANDLER_H

#include <string>
#include <vector>

class IOHandler {
public:
    // destructor
    virtual ~IOHandler() = default;

    // print string to output source
    virtual void print(const std::string& s) = 0; 
    // get user input fro input source
    virtual std::string readInput() = 0;
    
};

#endif