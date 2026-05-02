#include "include/CommandManager.h"

// singleton pattern - ensures only one instance of CommandManager exists
CommandManager& CommandManager::getInstance(IOHandler& io) {
    // first call creates the instance with the provided io reference
    // subsequent calls ignore the io argument and return the existing instance.
    static CommandManager instance(io);
    return instance;
}

// private constructor - initializes the commands map with all available commands
// receives io by reference since all commands need it for input/output operations
// io is stored as a member field for potential future use
CommandManager::CommandManager(IOHandler& io) : io(io) {
    // empty for now - will add commands once we have all the Commands classes implemented
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