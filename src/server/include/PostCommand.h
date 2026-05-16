#ifndef POSTCOMMAND_H
#define POSTCOMMAND_H
#include "AddCommand.h"

class PostCommand : public AddCommand {
public:
    PostCommand(UserManager& userManager, ProductManager& productManager, IOHandler& ioHandler, IDataHandler* dataHandler = nullptr);
    void execute(const std::vector<std::string>& args) override;
};

#endif
