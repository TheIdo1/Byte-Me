#ifndef POSTCOMMAND_H
#define POSTCOMMAND_H
#include "ICommand.h"
#include "IDataHandler.h"
#include "IOHandler.h"
#include "User.h"
#include "Product.h"
#include "UserManager.h"
#include "ProductManager.h"
#include <string>

class PostCommand : public ICommand {
    private:
        std::string description;
        UserManager& userManager;
        ProductManager& productManager;
        IDataHandler* dataHandler;
        IOHandler& ioHandler;
    public:
        PostCommand(UserManager& userManager, ProductManager& productManager, IOHandler& ioHandler, IDataHandler* dataHandler = nullptr);
        void execute(const std::vector<std::string>& args) override;
        bool validate(const std::vector<std::string>& args) const override;
        const std::string& getDescription() const override;
};

#endif
