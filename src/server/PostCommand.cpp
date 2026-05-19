#include "include/PostCommand.h"
#include "include/StatusCode.h"
#include <stdexcept>

// initializes managers, io reference, and description attributes
// dataHandler is optional - when provided, changes are persisted to storage
PostCommand::PostCommand(UserManager& userManager, ProductManager& productManager, IOHandler& ioHandler, IDataHandler* dataHandler):
userManager(userManager),
productManager(productManager),
ioHandler(ioHandler),
dataHandler(dataHandler) {}

// creates a new user and populates their watch list
// prints 400 if fewer than 2 args or user already exists, 404 if userId cannot be parsed
void PostCommand::execute(const std::vector<std::string>& args) {
    if (!validate(args)) {
        ioHandler.print(Http::getStatusMessage(Http::StatusCode::BadRequest));
        return;
    }

    int userId;
    try {
        userId = std::stoi(args[0]);
    } catch(const std::exception& e) {
        ioHandler.print(Http::getStatusMessage(Http::StatusCode::NotFound));
        return;
    }

    if (userManager.getUser(userId) != nullptr) {
        ioHandler.print(Http::getStatusMessage(Http::StatusCode::BadRequest));
        return;
    }

    userManager.addUser(userId, "User-" + std::to_string(userId));
    User* user = userManager.getUser(userId);

    for (int i = 1; i < (int)args.size(); i++) {
        int productId = std::stoi(args[i]);
        Product* product = productManager.getProduct(productId);
        if (product == nullptr) {
            productManager.addProduct(productId, "Product-" + std::to_string(productId), rand() % 1000);
            product = productManager.getProduct(productId);
        }
        user->addProductWatched(*product);
    }
    if (dataHandler) {
        dataHandler->saveUser(*user);
    }
    ioHandler.print(Http::getStatusMessage(Http::StatusCode::Created));
}

bool PostCommand::validate(const std::vector<std::string>& args) const {
    return args.size() >= 2;
}

//description methods
const std::string& PostCommand::getName() const {
    return name;
}
const std::string& PostCommand::getArgsDescription() const {
    return argsDescription;
}
