#include "include/Console.h"
#include <sstream>

// creates console and initializes streams; defaults to std::cin / std::cout if not provided
Console::Console(std::istream& inputStream, std::ostream& outputStream)
    : in(inputStream), out(outputStream) {}

void Console::readInput() {
    std::getline(in, input);
}

// extract cmdType (first token) and args (remaining tokens) from the input field
void Console::parser() {
    cmdType = "";
    args.clear(); //ensures the vector is empty before getting started

    std::istringstream ss(input);
    ss >> cmdType;  // extract first token as command type

    std::string token;
    // each iteration, ss reads chars until hits white character (space,enter,tab)
    while (ss >> token) {
        //the push_back method adding new element to the end of the vector
        args.push_back(token);
    }
}
// writes string s to the output stream
void Console::print(const std::string& s) {
    out << s;
}

// returns the raw input line that stored by readInput()
const std::string& Console::getInput() const {
    return input;
}

// returns the command type extracted by parser()
const std::string& Console::getCmdType() const {
    return cmdType;
}

// returns the argument list extracted by parser()
const std::vector<std::string>& Console::getArgs() const {
    return args;
}