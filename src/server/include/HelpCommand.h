#ifndef HELPCOMMAND_H
#define HELPCOMMAND_H

#include "ICommand.h"
#include "IOHandler.h"
#include <string>
#include <vector>

class HelpCommand : public ICommand {
private:
    std::string description;            // the command description that is printed when invoking help command. here the description is 'help'
    std::vector<ICommand*> commands;    // all the commands but the HelpCommand [AppCommand, RecommendCommand, ...]
    IOHandler& io;                      // reference to the io handler used for printing command descriptions

public:
    // constructor - receives all commands and io for printing
    HelpCommand(const std::vector<ICommand*>& commands, IOHandler& io);

    // prints description of all commands via IOHandler implementer
    void execute(const std::vector<std::string>& args) override;

    // validates args passed to the command
    bool validate(const std::vector<std::string>& args) const override;

    // returns description of HelpCommand itself
    const std::string& getDescription() const override;
};

#endif