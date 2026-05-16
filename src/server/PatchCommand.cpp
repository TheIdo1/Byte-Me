#include "include/PatchCommand.h"
#include "include/StatusCode.h"
#include <stdexcept>

PatchCommand::PatchCommand(UserManager& userManager, ProductManager& productManager, IOHandler& ioHandler, IDataHandler* dataHandler):
userManager(userManager),
productManager(productManager),
ioHandler(ioHandler),
dataHandler(dataHandler),
description("PATCH [userId] [productId1] [productId2] ...") {}

void PatchCommand::execute(const std::vector<std::string>& args) {
    if (!validate(args)) {
        ioHandler.print(Http::getStatusMessage(Http::StatusCode::BadRequest));
        return;
    }

    int userId;
    try {
        userId = std::stoi(args[0]);
    } catch(const std::exception& e) {
        ioHandler.print(Http::getStatusMessage(Http::StatusCode::BadRequest));
        return;
    }

    User* user = userManager.getUser(userId);
    if (user == nullptr) {
        ioHandler.print(Http::getStatusMessage(Http::StatusCode::BadRequest));
        return;
    }

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
        dataHandler->deleteUser(userId);
        dataHandler->saveUser(*user);
    }
    ioHandler.print(Http::getStatusMessage(Http::StatusCode::NoContent));
}

bool PatchCommand::validate(const std::vector<std::string>& args) const {
    if (args.size() < 2) {
        return false;
    }
    return true;
}

const std::string& PatchCommand::getDescription() const {
    return description;
}
