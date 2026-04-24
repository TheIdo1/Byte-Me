#include "../src/include/App.h"
#include <sstream>
#include <vector>


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
        return tokens.size() >= 3;
    } 
    
    else if (cmdType == "recommend") {
        // recommend command should contain exactly 3 entries "recommend [userid] [productid]"
        return tokens.size() == 3;
    }

    return false; // unfamilier command type
}