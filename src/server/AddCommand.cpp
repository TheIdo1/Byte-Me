#include "include/AddCommand.h"

AddCommand::AddCommand(UserManager& userManager, ProductManager& productManager, IOHandler& ioHandler, IDataHandler* dataHandler):
userManager(userManager),
productManager(productManager),
ioHandler(ioHandler),
dataHandler(dataHandler) {}

bool AddCommand::validate(const std::vector<std::string>& args) const {
    if (args.size() < 2) {
        return false;
    }
    return true;
}

const std::string& AddCommand::getDescription() const {
    return description;
}
