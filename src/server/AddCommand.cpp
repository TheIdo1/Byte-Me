#include "include/AddCommand.h"
#include <stdexcept>

AddCommand::AddCommand(UserManager& userManager, ProductManager& productManager, IDataHandler* dataHandler):
userManager(userManager),
productManager(productManager),
dataHandler(dataHandler),
description("add [userId] [productId1] [productId2] ...") {}

void AddCommand::execute(const std::vector<std::string>& args) {
    if (!validate(args)) {
        return; // Invalid arguments, do nothing
    }

    int userId;
    try
    {
        userId = std::stoi(args[0]);
    }
    catch(const std::exception& e)
    {
        return; // userId is not a valid integer, do nothing
    }
    
    User* user = userManager.getUser(userId);
    if (user==nullptr) {
        //creates user in case it doesn't exist
        userManager.addUser(userId, "User-" + std::to_string(userId));
        user = userManager.getUser(userId);
    }
    for  (int i=1; i<args.size(); i++) {
        int productId = std::stoi(args[i]);
        Product* product = productManager.getProduct(productId);
        if (product == nullptr) {
            //creates product in case it doesn't exist
            productManager.addProduct(productId, "Product-" + std::to_string(productId), rand() % 1000);
            product = productManager.getProduct(productId);
        }
        user->addProductWatched(*product);
    }
    if (dataHandler) {
        dataHandler->deleteUser(userId);
        dataHandler->saveUser(*user);
    }
}

bool AddCommand::validate(const std::vector<std::string>& args) const {
    if (args.size() < 2) {
        return false; // Need at least one userId and one productId
    }
    return true;
}

const std::string& AddCommand::getDescription() const {
    return description;
}