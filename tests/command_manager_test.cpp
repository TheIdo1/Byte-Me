#include <gtest/gtest.h>
#include "../src/include/CommandManager.h"

// Mock IOHandler for testing
class MockIOHandler : public IOHandler {
public:
    void print(const std::string& s) override {}
    void readInput() override {}
    void parser() override {}
};

// Test 1: singleton returns same instance
TEST(CommandManagerTest, SingletonReturnsSameInstance) {
    MockIOHandler mockIo;
    CommandManager& instance1 = CommandManager::getInstance(mockIo);
    CommandManager& instance2 = CommandManager::getInstance(mockIo);
    EXPECT_EQ(&instance1, &instance2);
}

// Test 2: commands map is not empty
TEST(CommandManagerTest, CommandsMapIsNotEmpty) {
    MockIOHandler mockIo;
    auto& commands = CommandManager::getInstance(mockIo).getCommands();
    EXPECT_FALSE(commands.empty());
}

// Test 3: expected keys exist in the map
// we check each command key that should exist in the map.
TEST(CommandManagerTest, MapContainsExpectedCommands) {
    MockIOHandler mockIo;
    auto& commands = CommandManager::getInstance(mockIo).getCommands();
    // find() returns end() if key doesn't exist so NE means key was found
    EXPECT_NE(commands.find("help"),      commands.end());
    EXPECT_NE(commands.find("add"),       commands.end());
    EXPECT_NE(commands.find("recommend"), commands.end());
}

// Test 4: command pointers are not null
TEST(CommandManagerTest, CommandPointersAreNotNull) {
    MockIOHandler mockIo;
    auto& commands = CommandManager::getInstance(mockIo).getCommands();
    // pair.first = the scommandType string (like "help")
    // pair.second = the ICommand* pointer
    for (auto& pair : commands) {
        EXPECT_NE(pair.second, nullptr);
    }
}