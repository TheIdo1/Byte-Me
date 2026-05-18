#include "include/DeleteCommand.h"
#include "include/StatusCode.h"
#include <vector>

DeleteCommand::DeleteCommand(UserManager& userManager, ProductManager& productManager, IOHandler& ioHandler, IDataHandler& dataHandler)
: userManager(userManager), productManager(productManager), ioHandler(ioHandler), dataHandler(dataHandler) {
};

//description methods
const std::string& DeleteCommand::getName() const {
    return name;
}
const std::string& DeleteCommand::getArgsDescription() const {
    return argsDescription;
}

// check if args are in the appropriate size.
bool DeleteCommand::validate(const std::vector<std::string>& args) const {
    if (args.size()<2){
        return false;
    }

    return true;
}

void DeleteCommand::execute(const std::vector<std::string>& args) {
    // if invalid call, arguemnt structure wise - return bad request.
    if (!DeleteCommand::validate(args)){
        ioHandler.print(Http::getStatusMessage(Http::StatusCode::BadRequest));
        return;
    }
    
    // try fetch user ID from args[0], if fails, return not Found.
    int userId;
    try {
        userId = std::stoi(args[0]);
    } catch(const std::exception& e) {
        ioHandler.print(Http::getStatusMessage(Http::StatusCode::NotFound));
        return;
    }

    User* user = userManager.getUser(userId);
    if (user == nullptr) {
        ioHandler.print(Http::getStatusMessage(Http::StatusCode::NotFound));
        return;
    }

    //chekcs that all products exists before removing them, if even one doesnt exists, do nothing and return 404.
    vector<Product*> removeProducts;
    for (int i = 1; i < (int)args.size(); i++) {
    int productId;
        try{
            // 404 if typed string as id.
            productId = std::stoi(args[i]);
        } catch (const std::exception& e){
            ioHandler.print(Http::getStatusMessage(Http::StatusCode::NotFound));
            return;
        }
        Product* product = productManager.getProduct(productId);
        if (product == nullptr) {
            // product does not exist, return NotFound.
            ioHandler.print(Http::getStatusMessage(Http::StatusCode::NotFound));
            return;
        }
        removeProducts.push_back(product);
    }
    
    for (auto p : removeProducts){
        user->removedProductWatched(*p);
    }
    
    //update user.
    dataHandler.deleteUser(userId);
    dataHandler.saveUser(*user);


    ioHandler.print(Http::getStatusMessage(Http::StatusCode::NoContent));


}