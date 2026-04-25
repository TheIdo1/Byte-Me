#include "HelpCommand.h"

// initializes HelpCommand with the list of all registered commands
HelpCommand::HelpCommand(const std::vector<ICommand*>& commands)
    : commands(commands), description("") {}

// prints description of all commands via IOHandler
void HelpCommand::execute() {
    // TODO
}

// validates that no args were passed to help command
bool HelpCommand::validate(const std::vector<std::string>& args) const {
    // TODO
}

// returns description of HelpCommand itself
const std::string& HelpCommand::getDescription() const {
    // TODO
}