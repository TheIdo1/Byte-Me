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
    //commands attribute in second thought does not belong to Console logic and should by higher in hierarchy
    //std::map<std::string, std::unique_ptr<ICommand>> commands;
    std::string input;              // the input - read from cin
    std::string cmdType;            // the command type :add, recomend, help etc. 
    std::vector<std::string> args;  // the rest of entries extracted from input [userId, prodId1, prodId2, ...]

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
    void readInput() override;

    // parses the current input line into command type and arguments.
    void parser() override;

    //print given string s to cout
    void print(const std::string& s) override;

    //getters

    //first const for stressing the returned string cannot be changed
    //second const for stressing no changes the object itself
    const std::string& getInput() const;
    const std::string& getCmdType() const;
    const std::vector<std::string>& getArgs() const;

};

#endif