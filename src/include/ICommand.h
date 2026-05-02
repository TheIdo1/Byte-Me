#ifndef ICOMMAND_H
#define ICOMMAND_H

#include <string>
#include <vector>

class ICommand {
public:
    // destructor
    virtual ~ICommand() = default;

    // executes specific logic of command
    virtual void execute() = 0; 

    // validates args passed to the command
    virtual bool validate(const std::vector<std::string>& args) const = 0;

    // returns description of the command - will be used by some IOHandler
    // exemple: for the recommend command the description is 'recommend [userId] [prodId]'
    virtual const std::string& getDescription() const = 0;
};

#endif