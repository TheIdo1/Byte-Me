#ifndef CONSOLE_H
#define CONSOLE_H

#include "IOHandler.h"
#include "ICommand.h"

#include <map> // Include the map library
#include <string> // Include the string library
#include <memory> //for unique_ptr
#include <vector>
#include <iostream>

class Console : public IOHandler {
private:

    // Input/output streams used by the console. refs to refer an existing stream, not create its own copy
    // In normal runtime: std::cin / std::cout
    // In tests: fake streams such as istringstream / ostringstream
    std::istream& in;
    std::ostream& out;

public:

    //creates Console. If no arguments are provided default is std::cin for input and std::cout for output
    Console(std::istream& inputStream = std::cin,
            std::ostream& outputStream = std::cout);

    //reads one full line from the input stream into 'input' field.
    std::string readInput() override;

    //print given string s to cout
    void print(const std::string& s) override;


};

#endif