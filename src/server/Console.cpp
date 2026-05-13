#include "include/Console.h"
#include <sstream>

// creates console and initializes streams; defaults to std::cin / std::cout if not provided
Console::Console(std::istream& inputStream, std::ostream& outputStream)
    : in(inputStream), out(outputStream) {}

std::string Console::readInput() {
    std::string line;
    std::getline(in, line);
    return line;
}

// writes string s to the output stream
void Console::print(const std::string& s) {
    out << s;
}
