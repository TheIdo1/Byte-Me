#include "include/PostCommand.h"
#include "include/StatusCode.h"
#include <stdexcept>

PostCommand::PostCommand(UserManager& userManager, ProductManager& productManager, IOHandler& ioHandler, IDataHandler* dataHandler):
AddCommand(userManager, productManager, ioHandler, dataHandler) {
    name = "POST";
    argsDescription = "[userId] [productId1] [productId2] ...";
}

void PostCommand::execute(const std::vector<std::string>& args) {
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
        dataHandler->deleteUser(userId);
        dataHandler->saveUser(*user);
    }
    ioHandler.print(Http::getStatusMessage(Http::StatusCode::Created));
}
