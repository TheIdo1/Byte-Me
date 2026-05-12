#include "include/App.h"

#include "include/IOHandler.h"
#include "include/IDataHandler.h"
#include "include/CommandManager.h"
#include "include/UserManager.h"
#include "include/ProductManager.h"

App::App(IOHandler& io, IDataHandler* dataHandler) 
    : io(io), 
      dataHandler(dataHandler),
      // initialize singletons and store references to them
      productManager(ProductManager::getInstance(dataHandler)),
      userManager(UserManager::getInstance(dataHandler)),
      commandManager(CommandManager::getInstance(io, userManager, productManager, dataHandler)) {
}

void App::run(){
    //use IOHandler type
    //have infinte loop reading input
    
    while(true){
        // read and parse the user's input
        io.readInput();
        io.parser();
        
        // fetch the parsed command type and arguments.
        const std::string& cmdType = io.getCmdType();
        const std::vector<std::string>& args = io.getArgs();
        
        // skip execution if the user pressed 'Enter' without typing any command
        if (cmdType.empty()) {
            continue;
        }

        // Get the reference to the commands map from the CommandManager
        std::map<std::string, ICommand*>& commands = commandManager.getCommands();
        
        // search for the command in the map using find().
        // This prevents the map from auto-inserting a null pointer for unknown keys.
        auto iterator = commands.find(cmdType);
        
        // Check if the command wasnt found (iterator did reach the end of the map)
        if (iterator == commands.end()) {
            // Command does not exist! do nothing
            continue;
        } 
        // 'it->second' accesses the ICommand* associated with the key.
        iterator->second->execute(args);

    }
}


// Sets up the application by loading products and users
// Assumes that DataHandler::loadProducts() and DataHandler::loadUsers()
// load the data and insert it into ProductManager and UsersManager
void App::setup(){
    dataHandler->loadProducts();
    dataHandler->loadUsers();
     
}
