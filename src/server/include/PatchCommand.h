#ifndef PATCHCOMMAND_H
#define PATCHCOMMAND_H
#include "AddCommand.h"

class PatchCommand : public AddCommand {
public:
    PatchCommand(UserManager& userManager, ProductManager& productManager, IOHandler& ioHandler, IDataHandler* dataHandler = nullptr);
    void execute(const std::vector<std::string>& args) override;
};

#endif
