#include "../src/include/App.h"
#include <sstream>
#include <vector>
#include <algorithm> // for std::all_of
#include <cctype>    // for std::isdigit

bool App::isNumeric(const std::string& s) {
    // checks that s isnot empty or contains non numeric characters
    return !s.empty() && std::all_of(s.begin(), s.end(), ::isdigit);
}

bool App::isValidCommand(const std::string& input) {
    // check if input contains tabs
    // std::string::npos meaning thers is no index matching to the find query
    if (input.find('\t') != std::string::npos) return false;

    // std::stringstream is a stream object (behaves like std::cin)
    // injects the user-input into ss the std::stringstream
    std::stringstream ss(input);
    std::string word;
    //vector to contain commands entries
    std::vector<std::string> tokens;

    // each iteration, ss reads chars until hits white character (space,enter,tab)
    while (ss >> word) {
        //the push_back method adding new element to the end of the vector
        tokens.push_back(word);
    }

    // empty input case
    if (tokens.empty()) return false;

    //extracting command Type
    std::string cmdType = tokens[0];

    // validating logic by type

    if (cmdType == "help") {
        // help command comes with no other entries
        return tokens.size() == 1;
    } 
    
    else if (cmdType == "add") {
        // add command should contain at least 3 entries "add [userid] [productid1]..."
        if (tokens.size() < 3) return false;
        // check that the rest of tokens are numeric
        for (int i = 1; i < tokens.size(); ++i) {
            if (!isNumeric(tokens[i])) return false;
        }
        return true;
    } 
    
    else if (cmdType == "recommend") {
        // recommend command should contain exactly 3 entries "recommend [userid] [productid]"
        if (tokens.size() != 3) return false;
        // check that the rest of tokens are numeric
        return isNumeric(tokens[1]) && isNumeric(tokens[2]);

    }

    return false; // unfamilier command type
}