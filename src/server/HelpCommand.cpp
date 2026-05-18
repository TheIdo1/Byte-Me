#include "include/HelpCommand.h"
#include "include/StatusCode.h"
#include <stdexcept>
#include <algorithm> // Required for std::sort

// initializes commands list, io reference, and the description attributes
HelpCommand::HelpCommand(const std::vector<ICommand*>& commands, IOHandler& io)
    : commands(commands), description("help"), io(io) {

    // Sort the vector once here. It will remain sorted for the entire lifecycle of the program
    // LAMBDA SYNTAX EXPLANATION
    // A lambda is just a quick, nameless function defined right where it's used: []() {}
    // [] (Capture clause) : Empty here, meaning we don't use any variables from outside the lambda.
    // () (Parameters)     : std::sort passes two elements from the vector (a and b) to compare.
    // {} (Function Body)  : We return true if 'a' should be ordered before 'b' (alphabetical order).
    std::sort(this->commands.begin(), this->commands.end(), [](ICommand* a, ICommand* b) {
        return a->getName() < b->getName();
    });
    }

// iterates over all registered commands and prints each one's description via io, and lastly it print help description
void HelpCommand::execute(const std::vector<std::string>& args) {
    // if validation does not pass,  excecute nothing
    if (!validate(args)) {
        io.print(Http::getStatusMessage(Http::StatusCode::BadRequest));
        return;
    }

    // iterate through all commands - the vector is already sorted
    for (ICommand* cmd : commands) {
        std::string argsDesc = cmd->getArgsDescription();
        
        // Check if the command requires arguments and print in the appropriate format
        if (argsDesc.empty()) {
            // Command does not take any arguments -> print only the name
            io.print(cmd->getName() + "\n");
        } else {
            // Command takes arguments -> print in the requested format
            io.print(cmd->getName() + ",arguments: " + argsDesc + "\n");
        }
    }

    // prints help's own description at the end
    io.print(this->getName() + "\n");
}

// validates that no args were passed to help command
bool HelpCommand::validate(const std::vector<std::string>& args) const {
    return args.empty();
}

//description methods
const std::string& HelpCommand::getName() const {
    return name;
}
const std::string& HelpCommand::getArgsDescription() const {
    return argsDescription;
}