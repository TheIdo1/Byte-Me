#include "../src/server/include/PatchCommand.h"
#include "../src/server/include/ProductManager.h"
#include "../src/server/include/UserManager.h"
#include "../src/server/include/IOHandler.h"
#include <gtest/gtest.h>
#include <vector>

using namespace std;

class FakeIOHandlerPatch : public IOHandler {
public:
    void print(const std::string&) override {}
    std::string readInput() override { return ""; }
};

class FakeDataHandlerPatch : public IDataHandler {
public:
    void saveUser(const User&) override {}
    std::vector<User> loadUsers() override { return {}; }
    void deleteUser(int) override {}
    void updateUser(const User&) override {}
    void saveProduct(const Product&) override {}
    std::vector<Product> loadProducts() override { return {}; }
    void deleteProduct(int) override {}
    void updateProduct(const Product&) override {}
};

class PatchCommandTest : public ::testing::Test {
protected:
    FakeIOHandlerPatch io;
    FakeDataHandlerPatch dataHandler;

    void SetUp() override {
        auto& pm = ProductManager::getInstance(dataHandler);
        for (int id : {100, 101, 102}) {
            try { pm.removeProduct(id); } catch (...) {}
        }
        pm.addProduct(100, "Keyboard", 49.99);
        pm.addProduct(101, "Mouse", 29.99);
        pm.addProduct(102, "Monitor", 199.99);

        try { UserManager::getInstance(dataHandler).removeUser(1); } catch (...) {}
        UserManager::getInstance(dataHandler).addUser(1, "Alice");
    }

    void TearDown() override {
        for (int id : {100, 101, 102, 200}) {
            try { ProductManager::getInstance(dataHandler).removeProduct(id); } catch (...) {}
        }
        for (int id : {1, 2}) {
            try { UserManager::getInstance(dataHandler).removeUser(id); } catch (...) {}
        }
    }
};

TEST_F(PatchCommandTest, ReturnsFalseWhenTooFewArguments) {
    PatchCommand command(UserManager::getInstance(dataHandler), ProductManager::getInstance(dataHandler), io, dataHandler);
    vector<string> args = {"1"};
    EXPECT_FALSE(command.validate(args));
}

TEST_F(PatchCommandTest, ValidateReturnsTrueForValidArgs) {
    PatchCommand command(UserManager::getInstance(dataHandler), ProductManager::getInstance(dataHandler), io, dataHandler);
    vector<string> args = {"1", "100"};
    EXPECT_TRUE(command.validate(args));
}

TEST_F(PatchCommandTest, ExecuteDoesNothingWhenUserDoesNotExist) {
    PatchCommand command(UserManager::getInstance(dataHandler), ProductManager::getInstance(dataHandler), io, dataHandler);
    vector<string> args = {"2", "100"};
    command.execute(args);
    EXPECT_EQ(UserManager::getInstance(dataHandler).getUser(2), nullptr);
}

TEST_F(PatchCommandTest, ExecuteAddsProductsToExistingUser) {
    PatchCommand command(UserManager::getInstance(dataHandler), ProductManager::getInstance(dataHandler), io, dataHandler);
    vector<string> args = {"1", "100", "101"};
    command.execute(args);
    User* user = UserManager::getInstance(dataHandler).getUser(1);
    ASSERT_NE(user, nullptr);
    EXPECT_EQ(user->getProductsWatched().size(), 2u);
    EXPECT_EQ(user->getProductsWatched()[0].getId(), 100);
    EXPECT_EQ(user->getProductsWatched()[1].getId(), 101);
}

TEST_F(PatchCommandTest, ExecuteCreatesProductIfNotExists) {
    PatchCommand command(UserManager::getInstance(dataHandler), ProductManager::getInstance(dataHandler), io, dataHandler);
    vector<string> args = {"1", "200"};
    command.execute(args);
    Product* product = ProductManager::getInstance(dataHandler).getProduct(200);
    ASSERT_NE(product, nullptr);
    EXPECT_EQ(product->getName(), "Product-200");
    User* user = UserManager::getInstance(dataHandler).getUser(1);
    ASSERT_NE(user, nullptr);
    EXPECT_EQ(user->getProductsWatched().size(), 1u);
    EXPECT_EQ(user->getProductsWatched()[0].getId(), 200);
}

TEST_F(PatchCommandTest, GetNameAndArgsReturnExpectedStrings) {
    PatchCommand command(UserManager::getInstance(dataHandler), ProductManager::getInstance(dataHandler), io, dataHandler);
    EXPECT_EQ(command.getName(), "PATCH");
    EXPECT_EQ(command.getArgsDescription(), "[userId] [productId1] [productId2] ...");
}
