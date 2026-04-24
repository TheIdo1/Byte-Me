#include "include/Console.h"

Console::Console(std::istream& inputStream, std::ostream& outputStream)
    : in(inputStream), out(outputStream) {}

void Console::readInput() {
    std::getline(in, input);
}

void Console::parser() {
    // TODO
}

void Console::print(const std::string& s) {
    out << s;
}

const std::string& Console::getInput() const {
    return input;
}