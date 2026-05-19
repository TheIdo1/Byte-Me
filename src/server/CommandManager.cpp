#include "include/CommandManager.h"
#include "include/PostCommand.h"
#include "include/PatchCommand.h"
#include "include/HelpCommand.h"
#include "include/RecommendCommand.h"
#include "include/DeleteCommand.h"

// singleton pattern - ensures only one instance of CommandManager exists
CommandManager& CommandManager::getInstance(IOHandler& io, UserManager& userManager, ProductManager& productManager, IDataHandler& dataHandler) {
    // first call creates the instance with the provided io reference
    // subsequent calls ignore the io argument and return the existing instance.
    static CommandManager instance(io, userManager, productManager, dataHandler);
    return instance;
}

// private constructor - initializes the commands map with all available commands
// receives io by reference since all commands need it for input/output operations
// io is stored as a member field for potential future use
CommandManager::CommandManager(IOHandler& io, UserManager& userManager, ProductManager& productManager, IDataHandler& dataHandler) : io(io) {
    // create add and recommend first since HelpCommand needs them
    //TODO: unify the way addCommand and RecommendCommand recieves their arguments
    commands["POST"]      = new PostCommand(userManager, productManager, io, dataHandler);
    commands["PATCH"]     = new PatchCommand(userManager, productManager, io, dataHandler);
    commands["DELETE"]     = new DeleteCommand(userManager, productManager, io, dataHandler);
    commands["GET"] = new RecommendCommand(userManager, productManager, io);

    // collect all commands so far to pass to HelpCommand
    std::vector<ICommand*> allCommands;
    for (auto& pair : commands) {
        allCommands.push_back(pair.second);
    }

    // HelpCommand gets all others + prints itself separately in execute()
    commands["help"] = new HelpCommand(allCommands, io);
}

// returns a reference to the commands map
std::map<std::string, ICommand*>& CommandManager::getCommands() {
    return commands;
}

// destructor implementation since CommandManager owns the command objects (created with new),
// it is responsible for deleting them to prevent memory leaks
CommandManager::~CommandManager() {
    for (auto& pair : commands) {
        delete pair.second;  // pair.first = string key, pair.second = ICommand* pointer
    }
}