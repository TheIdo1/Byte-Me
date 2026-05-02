#include "include/AddCommand.h"

AddCommand::AddCommand(UserManager* userManager, ProductManager* productManager): 
userManager(userManager),
productManager(productManager),
description("add [userId] [productId1] [productId2] ...") {}

AddCommand::execute(const std::vector<std::string>& args) {
    //reset everyting in any execution
    user = nullptr;
    productsToAdd.clear();
    if (validate(args)) {
        for (Product& product : productsToAdd) {
            user->getProductsWatched().push_back(product);
        }
    }
}

AddCommand::validate(const std::vector<std::string>& args) const {
    if (args.size() < 2) {
        return false; // Need at least one userId and one productId
    }
    // Validate userId
    try {
        int id = std::stoi(args[0]);
        user = userManager->getUser(id);
        if (user == nullptr || !user->isValid()) {
            throw std::invalid_argument("User with ID " + args[0] + " does not exist."); 
        }
    } catch (const std::exception&) {
        return false; // userId is not a valid integer
    }
    // Validate productIds
    for (size_t i = 1; i < args.size(); ++i) {
        try {
            int id =std::stoi(args[i]);
            Product* product = productManager->getProduct(id);
            if (product == nullptr || !product->isValid()) {
                throw std::invalid_argument("Product with ID " + args[i] + " does not exist."); 
            }
            productsToAdd.push_back(*product);
        } catch (const std::exception&) {
            return false; // productId is not a valid integer
        }
    }
    return true;
}

AddCommand::getDescription() const {
    return description;
}