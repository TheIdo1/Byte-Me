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
    virtual void readInput() = 0;
    // extract commandType and args from input
    virtual void parser() = 0; 
    
    // Retrieves the parsed command type (example: "add", "help")
    // Returns a const reference to prevent accidental modification
    virtual const std::string& getCmdType() const = 0;
    
    // Retrieves the parsed arguments (example ["1", "104"])
    // Returns a const reference to prevent accidental modification
    virtual const std::vector<std::string>& getArgs() const = 0;
};

#endif