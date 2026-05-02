#include "include/HelpCommand.h"

// initializes commands list, io reference, and the description attributes
HelpCommand::HelpCommand(const std::vector<ICommand*>& commands, IOHandler& io)
    : commands(commands), description("help"), io(io) {}

//TODO:UPDATE THE FLOW OF EXECUTE: MATCH THE ICCOMMAND NEW DEMANDS AND TO INVOKE VALIDATE FROM WITHIN EXECUTE
// iterates over all registered commands and prints each one's description via io, and lastly it print help description
void HelpCommand::execute(const std::vector<std::string>& args) {
    for (ICommand* cmd : commands) {
        io.print(cmd->getDescription());
    }
    // prints help's own description at the end
    io.print(this->getDescription());
}

// validates that no args were passed to help command
bool HelpCommand::validate(const std::vector<std::string>& args) const {
    return args.empty();
}

// returns description of HelpCommand itself
const std::string& HelpCommand::getDescription() const {
    return description;
}