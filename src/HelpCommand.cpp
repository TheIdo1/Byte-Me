#include "HelpCommand.h"

// initializes commands list, io reference, and hardcodes the description since it never changes
HelpCommand::HelpCommand(const std::vector<ICommand*>& commands, IOHandler& io)
    : commands(commands), description("help"), io(io) {}

// iterates over all registered commands and prints each one's description via io
void HelpCommand::execute() {
    for (ICommand* cmd : commands) {
        io.print(cmd->getDescription());
    }
}

// validates that no args were passed to help command
bool HelpCommand::validate(const std::vector<std::string>& args) const {
    return args.empty();
}

// returns description of HelpCommand itself
const std::string& HelpCommand::getDescription() const {
    return description;
}