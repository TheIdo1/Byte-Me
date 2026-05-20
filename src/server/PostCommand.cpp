#include "include/PostCommand.h"
#include "include/StatusCode.h"
#include <stdexcept>

PostCommand::PostCommand(UserManager& userManager, ProductManager& productManager, IOHandler& ioHandler, IDataHandler& dataHandler, IFormatter& formatter):
userManager(userManager),
productManager(productManager),
ioHandler(ioHandler),
dataHandler(dataHandler), 
formatter(formatter) {}

// creates a new user and populates their watch list
// prints 400 if fewer than 2 args or user already exists, 404 if userId cannot be parsed
void PostCommand::execute(const std::vector<std::string>& args) {
    std::string result;
    if (!validate(args)) {
        result = formatter.format((Http::StatusCode::BadRequest), {});
        ioHandler.print(result);
        return;
    }


    // try to conver id to int
    int userId;
    try {
        userId = std::stoi(args[0]);
    } catch(const std::exception& e) {
        result = formatter.format((Http::StatusCode::NotFound), {});
        ioHandler.print(result);
        return;
    }
    
    //check if ID exists, if yes 
    if (userManager.getUser(userId) != nullptr) {
        result = formatter.format((Http::StatusCode::NotFound), {});
        ioHandler.print(result);
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
    dataHandler.saveUser(*user);
    result = formatter.format((Http::StatusCode::Created), {});
    ioHandler.print(result);
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
