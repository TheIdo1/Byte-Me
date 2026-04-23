#ifndef ICOMMAND_H
#define ICOMMAND_H


class ICommand {
public:
    // destructor
    virtual ~ICommand() = default;

    // executes specific logic of command
    virtual void execute() = 0; 
};

#endif