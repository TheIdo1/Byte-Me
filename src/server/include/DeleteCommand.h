#ifndef DELETE_COMMAND_H
#define DELTE_COMMAND_H
#include "ICommand.h"
#include "UserManager.h"
#include "ProductManager.h"
#include "IOHandler.h"
#include "IDataHandler.h"


class DeleteCommand : public ICommand {
    public:
    DeleteCommand(UserManager& userManager, ProductManager& productManager, IOHandler& ioHandler, IDataHandler& dataHandler);

    void execute(const std::vector<std::string>& args) override;

    bool validate(const std::vector<std::string>& args) const override;

    //description methods
    const std::string& getName() const override;
    const std::string& getArgsDescription() const override;

private:
    //description attributes
    std::string name = "DELETE";
    std::string argsDescription = "[userid] [productid1] [productid2] ...";

    UserManager& userManager;
    ProductManager& productManager;
    IOHandler& ioHandler;
    IDataHandler& dataHandler;

    
};

#endif