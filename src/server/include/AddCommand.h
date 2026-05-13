#ifndef ADDCOMMAND_H
#define ADDCOMMAND_H
#include "ICommand.h"
#include "IDataHandler.h"
#include "User.h"
#include "Product.h"
#include "UserManager.h"
#include "ProductManager.h"
#include <string>

class AddCommand : public ICommand {
    private:
        std::string description;
        UserManager& userManager;
        ProductManager& productManager;
        IDataHandler* dataHandler;
    public:
        AddCommand(UserManager& userManager, ProductManager& productManager, IDataHandler* dataHandler = nullptr);
        void execute(const std::vector<std::string>& args) override;
        bool validate(const std::vector<std::string>& args) const override;
        const std::string& getDescription() const override;    
};

#endif