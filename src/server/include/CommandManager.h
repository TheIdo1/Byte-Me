#ifndef COMMAND_MANAGER_H
#define COMMAND_MANAGER_H

#include "ICommand.h"
#include "IOHandler.h"
#include "ICommand.h"
#include "IOHandler.h"
#include "IDataHandler.h"
#include "UserManager.h"
#include "ProductManager.h"

#include <map> // Include the map library
#include <string> // Include the string library

class CommandManager {
private:
    std::map<std::string, ICommand*> commands;
    IOHandler& io;

    //private constructor since it's singleton. need the reference of the io since it is passed to the Commands
    CommandManager(IOHandler& io, UserManager& userManager, ProductManager& productManager, IDataHandler& dataHandler);

public:
    static CommandManager& getInstance(IOHandler& io, UserManager& userManager, ProductManager& productManager, IDataHandler& dataHandler);

    CommandManager(const CommandManager&) = delete;
    CommandManager& operator=(const CommandManager&) = delete;
    ~CommandManager();

    std::map<std::string, ICommand*>& getCommands();
};

#endif