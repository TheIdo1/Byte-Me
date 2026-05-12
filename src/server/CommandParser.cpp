#include "include/CommandParser.h"
#include <sstream>

void CommandParser::parse(const std::string& input) {
    //ensures the vector and cmdType are empty before getting started
    cmdType = "";
    args.clear();

    std::istringstream ss(input);
    
    // extract first token as command type
    if (!(ss >> cmdType)) {
        return; 
    }

    
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