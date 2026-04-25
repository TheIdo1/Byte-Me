#ifndef HELPCOMMAND_H
#define HELPCOMMAND_H

#include "ICommand.h"
#include <string>
#include <vector>

class HelpCommand : public ICommand {
private:
    std::string description;            // help
    std::vector<ICommand*> commands;    // [AppCommand, RecommendCommand, HelpCommand, ...]

public:
    // constructor - receives list of all commands to print their descriptions
    HelpCommand(const std::vector<ICommand*>& commands);

    // prints description of all commands via IOHandler implementer
    void execute() override;

    // validates args passed to the command
    bool validate(const std::vector<std::string>& args) const override;

    // returns description of HelpCommand itself
    const std::string& getDescription() const override;
};

#endif