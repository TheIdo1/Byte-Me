#ifndef PATCHCOMMAND_H
#define PATCHCOMMAND_H
#include "ICommand.h"
#include "IDataHandler.h"
#include "IOHandler.h"
#include "UserManager.h"
#include "ProductManager.h"
#include <string>

// handles PATCH [userId] [productId1] [productId2] ...
// adds the given products to an existing user's watch list
// returns 204 on success, 404 if the user is not found or arguments cannot be parsed
class PatchCommand : public ICommand {
    std::string description;
    UserManager& userManager;
    ProductManager& productManager;
    IOHandler& ioHandler;
    IDataHandler* dataHandler;
public:
    PatchCommand(UserManager& userManager, ProductManager& productManager, IOHandler& ioHandler, IDataHandler* dataHandler = nullptr);
    void execute(const std::vector<std::string>& args) override;
    bool validate(const std::vector<std::string>& args) const override;
    const std::string& getDescription() const override;
};

#endif
