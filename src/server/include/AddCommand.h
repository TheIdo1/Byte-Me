#ifndef ADDCOMMAND_H
#define ADDCOMMAND_H
#include "ICommand.h"
#include "IDataHandler.h"
#include "IOHandler.h"
#include "User.h"
#include "Product.h"
#include "UserManager.h"
#include "ProductManager.h"
#include <string>

class AddCommand : public ICommand {
protected:
    std::string description;
    UserManager& userManager;
    ProductManager& productManager;
    IOHandler& ioHandler;
    IDataHandler* dataHandler;
public:
    AddCommand(UserManager& userManager, ProductManager& productManager, IOHandler& ioHandler, IDataHandler* dataHandler = nullptr);
    virtual void execute(const std::vector<std::string>& args) override = 0;
    bool validate(const std::vector<std::string>& args) const override;
    const std::string& getDescription() const override;
};

#endif
