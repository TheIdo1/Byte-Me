#ifndef POSTCOMMAND_H
#define POSTCOMMAND_H
#include "ICommand.h"
#include "IDataHandler.h"
#include "IOHandler.h"
#include "UserManager.h"
#include "ProductManager.h"
#include "IFormatter.h"
#include <string>

// handles POST [userId] [productId1] [productId2] ...
// creates a new user with the given products on their watch list
// returns 201 on success, 400 if the user already exists, 404 if arguments cannot be parsed
class PostCommand : public ICommand {
    //description attributes
    std::string name = "POST";
    std::string argsDescription = "[userId] [productId1] [productId2] ...";

    UserManager& userManager;
    ProductManager& productManager;
    IOHandler& ioHandler;
    IDataHandler& dataHandler;
    IFormatter& formatter;

public:
    PostCommand(UserManager& userManager, ProductManager& productManager, IOHandler& ioHandler, IDataHandler& dataHandler, IFormatter& formatter);
    void execute(const std::vector<std::string>& args) override;
    bool validate(const std::vector<std::string>& args) const override;
    
     //description methods
    const std::string& getName() const override;
    const std::string& getArgsDescription() const override;
};

#endif
