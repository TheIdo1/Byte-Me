#include "include/App.h"
#include "include/Console.h"
#include "include/FileHandler.h"

int main() {
    // Initialize the IOHandler. 
    // The Console class manages input and output, defaulting to std::cin and std::cout.
    Console console;

    // Initialize the parser
    // parser is responsible of taking the rawInput and parse it to cmdType and args
    CommandParser parser;

    // Initialize the DataHandler.
    // The FileHandler is responsible for loading from and saving to the local text files.
    FileHandler fileHandler;

    // Instantiate the main Application via Dependency Injection.
    // We pass the console (by reference), the CommandParser and the fileHandler (by pointer).
    App app(console, parser, &fileHandler);

    // Load initial data.
    // The setup method delegates the loading of products and users to the DataHandler,
    // which populates the ProductManager and UserManager.
    app.setup();

    // Start the application.
    // This triggers the infinite loop that reads user input, parses it, and executes commands.
    app.run();

    return 0;
}