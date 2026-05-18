#ifndef POSTCOMMAND_H
#define POSTCOMMAND_H
#include "ICommand.h"
#include "IDataHandler.h"
#include "IOHandler.h"
#include "UserManager.h"
#include "ProductManager.h"
#include <string>

// handles POST [userId] [productId1] [productId2] ...
// creates a new user with the given products on their watch list
// returns 201 on success, 400 if the user already exists, 404 if arguments cannot be parsed
class PostCommand : public ICommand {
    std::string description;
    UserManager& userManager;
    ProductManager& productManager;
    IOHandler& ioHandler;
    IDataHandler* dataHandler;
public:
    PostCommand(UserManager& userManager, ProductManager& productManager, IOHandler& ioHandler, IDataHandler* dataHandler = nullptr);
    void execute(const std::vector<std::string>& args) override;
    bool validate(const std::vector<std::string>& args) const override;
    const std::string& getDescription() const override;
};

#endif
