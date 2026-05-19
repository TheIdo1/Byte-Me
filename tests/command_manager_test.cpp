#include <gtest/gtest.h>
#include "../src/server/include/CommandManager.h"
#include "../src/server/include/UserManager.h"
#include "../src/server/include/ProductManager.h"

// Mock IOHandler for testing
class MockIOHandlerCommandManager : public IOHandler {
public:

    std::string cmdType;
    std::vector<std::string> args;

    void print(const std::string& s) override {}
    std::string readInput() override {}
    
};


// Test 1: singleton returns same instance
TEST(CommandManagerTest, SingletonReturnsSameInstance) {
    MockIOHandlerCommandManager mockIo;
    UserManager& userManager = UserManager::getInstance();
    ProductManager& productManager = ProductManager::getInstance();

    CommandManager& instance1 = CommandManager::getInstance(mockIo, userManager, productManager);
    CommandManager& instance2 = CommandManager::getInstance(mockIo, userManager, productManager);
    EXPECT_EQ(&instance1, &instance2);
}

// Test 2: commands map is not empty
TEST(CommandManagerTest, CommandsMapIsNotEmpty) {
    MockIOHandlerCommandManager mockIo;
    UserManager& userManager = UserManager::getInstance();
    ProductManager& productManager = ProductManager::getInstance();

    auto& commands = CommandManager::getInstance(mockIo, userManager, productManager).getCommands();
    EXPECT_FALSE(commands.empty());
}

// Test 3: expected keys exist in the map
// We check each command key that should exist in the map based on the real CommandManager implementation.
TEST(CommandManagerTest, MapContainsExpectedCommands) {
    MockIOHandlerCommandManager mockIo;
    UserManager& userManager = UserManager::getInstance();
    ProductManager& productManager = ProductManager::getInstance();
    auto& commands = CommandManager::getInstance(mockIo, userManager, productManager).getCommands();
    
    // Verify that all the uppercase REST-like command keys are present in the map
    EXPECT_NE(commands.find("POST"),      commands.end());
    EXPECT_NE(commands.find("PATCH"),     commands.end());
    EXPECT_NE(commands.find("DELETE"),    commands.end());
    EXPECT_NE(commands.find("GET"),       commands.end());
    EXPECT_NE(commands.find("HELP"),      commands.end());

    // Verify that the old lowercase keys are NO LONGER in the map
    EXPECT_EQ(commands.find("add"),       commands.end());
    EXPECT_EQ(commands.find("recommend"), commands.end());
    EXPECT_EQ(commands.find("help"),      commands.end());
}
// Test 4: command pointers are not null
TEST(CommandManagerTest, CommandPointersAreNotNull) {
    MockIOHandlerCommandManager mockIo;
    UserManager& userManager = UserManager::getInstance();
    ProductManager& productManager = ProductManager::getInstance();

    auto& commands = CommandManager::getInstance(mockIo, userManager, productManager).getCommands();
    // pair.first = the scommandType string (like "help")
    // pair.second = the ICommand* pointer
    for (auto& pair : commands) {
        EXPECT_NE(pair.second, nullptr);
    }
}