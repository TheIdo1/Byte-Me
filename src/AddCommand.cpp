#include "include/AddCommand.h"
#include <stdexcept>

AddCommand::AddCommand(UserManager* userManager, ProductManager* productManager): 
userManager(userManager),
productManager(productManager),
description("add [userId] [productId1] [productId2] ...") {}

void AddCommand::execute(const std::vector<std::string>& args) {
    if (!validate(args)) {
        throw std::invalid_argument("Invalid arguments for AddCommand.");
    }
    int userId = std::stoi(args[0]);
    User* user = userManager->getUser(userId);
    if (user==nullptr) {
        //creates user in case it doesn't exist
        userManager->addUser(userId, "User-" + std::to_string(userId));
        user = userManager->getUser(userId);
    }
    for  (int i=1; i<args.size(); i++) {
        int productId = std::stoi(args[i]);
        Product* product = productManager->getProduct(productId);
        if (product == nullptr) {
            //creates product in case it doesn't exist
            productManager->addProduct(productId, "Product-" + std::to_string(productId), rand() % 1000);
            product = productManager->getProduct(productId);
        }
        user->addProductWatched(*product);
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