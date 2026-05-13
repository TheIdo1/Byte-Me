#ifndef COMMAND_PARSER_H
#define COMMAND_PARSER_H

#include <string>
#include <vector>

class CommandParser {
private:
    std::string cmdType;            // the command type :add, recomend, help etc. 
    std::vector<std::string> args;  // the rest of entries extracted from input [userId, prodId1, prodId2, ...]

public:

    CommandParser() = default; // using the defult constructor
    
    // parses the current input line into command type and arguments.
    void parse(const std::string& input);

    // Retrieves the parsed command type (example: "add", "help")
    // Returns a const reference to prevent accidental modification
    const std::string& getCmdType() const;

    // Retrieves the parsed arguments (example ["1", "104"])
    // Returns a const reference to prevent accidental modification
    const std::vector<std::string>& getArgs() const;
};

#endif