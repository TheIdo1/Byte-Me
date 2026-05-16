#include "../src/server/include/PostCommand.h"
#include "../src/server/include/ProductManager.h"
#include "../src/server/include/UserManager.h"
#include "../src/server/include/IOHandler.h"
#include <gtest/gtest.h>
#include <vector>

using namespace std;

class NullIOHandlerPost : public IOHandler {
public:
    void print(const std::string&) override {}
    std::string readInput() override { return ""; }
};

class PostCommandTest : public ::testing::Test {
protected:
    NullIOHandlerPost io;

    void SetUp() override {
        auto& pm = ProductManager::getInstance();
        for (int id : {100, 101, 102}) {
            try { pm.removeProduct(id); } catch (...) {}
        }
        pm.addProduct(100, "Keyboard", 49.99);
        pm.addProduct(101, "Mouse", 29.99);
        pm.addProduct(102, "Monitor", 199.99);
    }

    void TearDown() override {
        for (int id : {100, 101, 102, 200, 201}) {
            try { ProductManager::getInstance().removeProduct(id); } catch (...) {}
        }
        for (int id : {1, 3, 10, 11, 12}) {
            try { UserManager::getInstance().removeUser(id); } catch (...) {}
        }
    }
};

TEST_F(PostCommandTest, ReturnsFalseWhenTooFewArguments) {
    PostCommand command(UserManager::getInstance(), ProductManager::getInstance(), io);
    vector<string> args = {"1"};
    EXPECT_FALSE(command.validate(args));
}

TEST_F(PostCommandTest, ValidateReturnsTrueForValidArgs) {
    PostCommand command(UserManager::getInstance(), ProductManager::getInstance(), io);
    vector<string> args = {"1", "100"};
    EXPECT_TRUE(command.validate(args));
}

TEST_F(PostCommandTest, ValidateReturnsTrueEvenWhenUserDoesNotExist) {
    PostCommand command(UserManager::getInstance(), ProductManager::getInstance(), io);
    vector<string> args = {"999", "100"};
    EXPECT_TRUE(command.validate(args));
}

TEST_F(PostCommandTest, ExecuteThrowsWhenProductIdIsInvalid) {
    PostCommand command(UserManager::getInstance(), ProductManager::getInstance(), io);
    vector<string> args = {"1", "xyz"};
    EXPECT_TRUE(command.validate(args));
    EXPECT_THROW(command.execute(args), invalid_argument);
}

TEST_F(PostCommandTest, ExecuteCreatesUserIfNotExists) {
    PostCommand command(UserManager::getInstance(), ProductManager::getInstance(), io);
    vector<string> args = {"10", "100"};
    EXPECT_TRUE(command.validate(args));
    command.execute(args);
    User* user = UserManager::getInstance().getUser(10);
    ASSERT_NE(user, nullptr);
    EXPECT_EQ(user->getId(), 10);
    EXPECT_EQ(user->getName(), "User-10");
    EXPECT_EQ(user->getProductsWatched().size(), 1u);
    EXPECT_EQ(user->getProductsWatched()[0].getId(), 100);
}

TEST_F(PostCommandTest, ExecuteCreatesProductIfNotExists) {
    PostCommand command(UserManager::getInstance(), ProductManager::getInstance(), io);
    vector<string> args = {"11", "200"};
    EXPECT_TRUE(command.validate(args));
    command.execute(args);
    Product* product = ProductManager::getInstance().getProduct(200);
    ASSERT_NE(product, nullptr);
    EXPECT_EQ(product->getId(), 200);
    EXPECT_EQ(product->getName(), "Product-200");
    EXPECT_GE(product->getPrice(), 0.0);
    EXPECT_LE(product->getPrice(), 999.0);
    User* user = UserManager::getInstance().getUser(11);
    ASSERT_NE(user, nullptr);
    EXPECT_EQ(user->getProductsWatched().size(), 1u);
    EXPECT_EQ(user->getProductsWatched()[0].getId(), 200);
}

TEST_F(PostCommandTest, ExecuteCreatesBothUserAndProductIfNotExist) {
    PostCommand command(UserManager::getInstance(), ProductManager::getInstance(), io);
    vector<string> args = {"12", "201"};
    EXPECT_TRUE(command.validate(args));
    command.execute(args);
    User* user = UserManager::getInstance().getUser(12);
    ASSERT_NE(user, nullptr);
    EXPECT_EQ(user->getId(), 12);
    EXPECT_EQ(user->getName(), "User-12");
    Product* product = ProductManager::getInstance().getProduct(201);
    ASSERT_NE(product, nullptr);
    EXPECT_EQ(product->getId(), 201);
    EXPECT_EQ(product->getName(), "Product-201");
    EXPECT_EQ(user->getProductsWatched().size(), 1u);
    EXPECT_EQ(user->getProductsWatched()[0].getId(), 201);
}

TEST_F(PostCommandTest, ExecuteAddsProductsToUser) {
    PostCommand command(UserManager::getInstance(), ProductManager::getInstance(), io);
    vector<string> args = {"3", "100", "101"};
    EXPECT_TRUE(command.validate(args));
    command.execute(args);
    User* user = UserManager::getInstance().getUser(3);
    ASSERT_NE(user, nullptr);
    EXPECT_EQ(user->getProductsWatched().size(), 2u);
    EXPECT_EQ(user->getProductsWatched()[0].getId(), 100);
    EXPECT_EQ(user->getProductsWatched()[1].getId(), 101);
}

TEST_F(PostCommandTest, ExecuteDoesNothingWhenUserAlreadyExists) {
    UserManager::getInstance().addUser(1, "Alice");
    PostCommand command(UserManager::getInstance(), ProductManager::getInstance(), io);
    vector<string> args = {"1", "100"};
    command.execute(args);
    User* user = UserManager::getInstance().getUser(1);
    ASSERT_NE(user, nullptr);
    EXPECT_EQ(user->getProductsWatched().size(), 0u);
}

TEST_F(PostCommandTest, GetDescriptionReturnsExpectedString) {
    PostCommand command(UserManager::getInstance(), ProductManager::getInstance(), io);
    EXPECT_EQ(command.getDescription(), "POST [userId] [productId1] [productId2] ...");
}
