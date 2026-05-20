#include "include/PatchCommand.h"
#include "include/StatusCode.h"
#include <stdexcept>

// initializes managers, io reference, and description attributes
PatchCommand::PatchCommand(UserManager& userManager, ProductManager& productManager, IOHandler& ioHandler, IDataHandler& dataHandler, IFormatter& formatter):
userManager(userManager),
productManager(productManager),
ioHandler(ioHandler),
dataHandler(dataHandler),
formatter(formatter) {}

// adds each listed product to the user's watch list
// prints 400 if fewer than 2 args, 404 if userId cannot be parsed or user does not exist
void PatchCommand::execute(const std::vector<std::string>& args) {
    std::string result;
    if (!validate(args)) {
        result = formatter.format((Http::StatusCode::BadRequest), {});
        ioHandler.print(result);
        return;
    }

    int userId;
    try {
        userId = std::stoi(args[0]);
    } catch(const std::exception& e) {
        result = formatter.format((Http::StatusCode::NotFound), {});
        ioHandler.print(result);
        return;
    }

    User* user = userManager.getUser(userId);
    if (user == nullptr) {
        result = formatter.format((Http::StatusCode::NotFound), {});
        ioHandler.print(result);
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
    dataHandler.updateUser(*user);
    result = formatter.format((Http::StatusCode::NoContent), {});
    ioHandler.print(result);
}

bool PatchCommand::validate(const std::vector<std::string>& args) const {
    return args.size() >= 2;
}


//description methods
const std::string& PatchCommand::getName() const {
    return name;
}
const std::string& PatchCommand::getArgsDescription() const {
    return argsDescription;
}
