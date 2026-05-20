#ifndef APP_H
#define APP_H
#include <vector>
#include <string>


#include "IOHandler.h"
#include "IDataHandler.h"
#include "CommandManager.h"
#include "UserManager.h"
#include "ProductManager.h"
#include "CommandParser.h"
#include "IFormatter.h"

class App {
private:
    IOHandler& io;
    CommandParser& parser;
    IDataHandler& dataHandler;

    // references to the singletons - convenient access without calling getInstance() every time
    UserManager& userManager;
    ProductManager& productManager;
    CommandManager& commandManager;
    IFormatter& formatter;

public:
    App(IOHandler& io, CommandParser& parser, IDataHandler& dataHandler, IFormatter& formatter);
    void run();

    // method for loading data from data source, via managers at the beginning of the program
    void setup();
};

#endif