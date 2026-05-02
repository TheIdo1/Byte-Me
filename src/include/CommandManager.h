#ifndef COMMAND_MANAGER_H
#define COMMAND_MANAGER_H

#include "ICommand.h"

#include <map> // Include the map library
#include <string> // Include the string library

class CommandManager {
private:
    std::map<std::string, ICommand*> commands;  // ← the map lives here

    CommandManager();  // private constructor

public:
    static CommandManager& getInstance();

    CommandManager(const CommandManager&) = delete;
    CommandManager& operator=(const CommandManager&) = delete;

    std::map<std::string, ICommand*>& getCommands();
};

#endif