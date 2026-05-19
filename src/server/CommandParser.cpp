#include "include/CommandParser.h"
#include <sstream>
#include <algorithm> // for std::transform
#include <cctype>    // for ::toupper

void CommandParser::parse(const std::string& input) {
    //ensures the vector and cmdType are empty before getting started
    cmdType = "";
    args.clear();

    std::istringstream ss(input);
    
    // extract first token as command type
    if (!(ss >> cmdType)) {
        return; 
    }

    
    //  Converts the command string to uppercase to enable case insensitivity.
    //  (For example: "delEte" will become "DELETE").
    //  The std::transform function iterates over the string from start (cmdType.begin()) 
    //  to end (cmdType.end()), applies the ::toupper function to each character, 
    //  and overwrites the original string with the result (the third parameter).
    //  The ::toupper function only affects lowercase English letters (a-z).
    //  If the input contains non-alphabetic characters it does nothin
    std::transform(cmdType.begin(), cmdType.end(), cmdType.begin(), ::toupper);
    
    std::string token;
    // each iteration, ss reads chars until hits white character (space,enter,tab)
    while (ss >> token) {
        args.push_back(token);
    }
}

const std::string& CommandParser::getCmdType() const {
    return cmdType;
}

const std::vector<std::string>& CommandParser::getArgs() const {
    return args;
}