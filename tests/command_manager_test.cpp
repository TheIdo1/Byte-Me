#include <gtest/gtest.h>
#include "../src/server/include/CommandManager.h"
#include "../src/server/include/UserManager.h"
#include "../src/server/include/ProductManager.h"

class MockIOHandlerCommandManager : public IOHandler {
public:
    std::string cmdType;
    std::vector<std::string> args;

    void print(const std::string& s) override {}
    std::string readInput() override { return ""; }
};

class MockDataHandlerCommandManager : public IDataHandler {
public:
    void saveUser(const User& user) override {}
    std::vector<User> loadUsers() override { return {}; }
    void deleteUser(int id) override {}
    void updateUser(const User& user) override {}

    void saveProduct(const Product& product) override {}
    std::vector<Product> loadProducts() override { return {}; }
    void deleteProduct(int id) override {}
    void updateProduct(const Product& product) override {}
};

class MockFormatterCommandManager : public IFormatter {
public:
    std::string format(Http::StatusCode code, const std::vector<std::string>& payload) const override { return ""; }
};

// Global instances so the singletons never hold dangling references
static MockIOHandlerCommandManager g_mockIo;
static MockDataHandlerCommandManager g_mockData;
static MockFormatterCommandManager g_mockFormatter;

// Test 1: singleton returns same instance
TEST(CommandManagerTest, SingletonReturnsSameInstance) {
    UserManager& userManager = UserManager::getInstance(g_mockData);
    ProductManager& productManager = ProductManager::getInstance(g_mockData);

    CommandManager& instance1 = CommandManager::getInstance(g_mockIo, userManager, productManager, g_mockData, g_mockFormatter);
    CommandManager& instance2 = CommandManager::getInstance(g_mockIo, userManager, productManager, g_mockData, g_mockFormatter);
    EXPECT_EQ(&instance1, &instance2);
}

// Test 2: commands map is not empty
TEST(CommandManagerTest, CommandsMapIsNotEmpty) {
    UserManager& userManager = UserManager::getInstance(g_mockData);
    ProductManager& productManager = ProductManager::getInstance(g_mockData);

    auto& commands = CommandManager::getInstance(g_mockIo, userManager, productManager, g_mockData, g_mockFormatter).getCommands();
    EXPECT_FALSE(commands.empty());
}

// Test 3: expected keys exist in the map
TEST(CommandManagerTest, MapContainsExpectedCommands) {
    UserManager& userManager = UserManager::getInstance(g_mockData);
    ProductManager& productManager = ProductManager::getInstance(g_mockData);
    auto& commands = CommandManager::getInstance(g_mockIo, userManager, productManager, g_mockData, g_mockFormatter).getCommands();

    EXPECT_NE(commands.find("POST"),      commands.end());
    EXPECT_NE(commands.find("PATCH"),     commands.end());
    EXPECT_NE(commands.find("DELETE"),    commands.end());
    EXPECT_NE(commands.find("GET"),       commands.end());
    EXPECT_NE(commands.find("HELP"),      commands.end());

    EXPECT_EQ(commands.find("add"),       commands.end());
    EXPECT_EQ(commands.find("recommend"), commands.end());
    EXPECT_EQ(commands.find("help"),      commands.end());
}

// Test 4: command pointers are not null
TEST(CommandManagerTest, CommandPointersAreNotNull) {
    UserManager& userManager = UserManager::getInstance(g_mockData);
    ProductManager& productManager = ProductManager::getInstance(g_mockData);

    auto& commands = CommandManager::getInstance(g_mockIo, userManager, productManager, g_mockData, g_mockFormatter).getCommands();
    for (auto& pair : commands) {
        EXPECT_NE(pair.second, nullptr);
    }
}
