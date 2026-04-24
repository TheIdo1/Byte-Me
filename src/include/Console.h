#include "IOHandler.h"
#include "ICommand.h"

#include <map> // Include the map library
#include <string> // Include the string library
#include <memory> //for unique_ptr
#include <vector>

class Console : public IOHandler {
private:
    std::map<std::string, std::unique_ptr<ICommand>> commands;
    std::string input;              // the input - read from cin
    std::string cmdType;            // the command type :add, reccomand, help etc. 
    std::vector<std::string> args;  // the rest of entries extracted from input [userId, prodId1, prodId2, ...]

public:
    //read user input from cin and sets the input field
    void readInput() override;
    // based on the input field, parses the string into commandtype and arguments
    // sets cmdType to extracted commandType and arguments into args 
    void parser() override;
    //print given string s to cout
    void print(const std::string& s) override;

};