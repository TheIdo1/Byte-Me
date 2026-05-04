#include "../src/include/AddCommand.h"
#include "../src/include/ProductManager.h"
#include "../src/include/UserManager.h"
#include <gtest/gtest.h>
#include <vector>

using namespace std;

class AddCommandTest : public ::testing::Test {
protected:
    void SetUp() override {
        ProductManager::getInstance().addProduct(100, "Keyboard", 49.99);
        ProductManager::getInstance().addProduct(101, "Mouse", 29.99);
        ProductManager::getInstance().addProduct(102, "Monitor", 199.99);
    }
};

TEST_F(AddCommandTest, ReturnsFalseWhenTooFewArguments) {
    AddCommand command(&UserManager::getInstance(), &ProductManager::getInstance());
    vector<string> args = {"1"};
    EXPECT_FALSE(command.validate(args));
}

TEST_F(AddCommandTest, ValidateReturnsTrueForValidArgs) {
    AddCommand command(&UserManager::getInstance(), &ProductManager::getInstance());
    vector<string> args = {"1", "100"};
    EXPECT_TRUE(command.validate(args));
}

TEST_F(AddCommandTest, ValidateReturnsTrueEvenWhenUserDoesNotExist) {
    AddCommand command(&UserManager::getInstance(), &ProductManager::getInstance());
    vector<string> args = {"999", "100"};
    EXPECT_TRUE(command.validate(args)); // validate doesn't check existence
}

TEST_F(AddCommandTest, ExecuteThrowsWhenUserIdIsInvalid) {
    AddCommand command(&UserManager::getInstance(), &ProductManager::getInstance());
    vector<string> args = {"abc", "100"};
    EXPECT_TRUE(command.validate(args)); // validate passes
    EXPECT_THROW(command.execute(args), invalid_argument); // stoi fails
}

TEST_F(AddCommandTest, ExecuteThrowsWhenProductIdIsInvalid) {
    UserManager::getInstance().addUser(1, "Alice");
    AddCommand command(&UserManager::getInstance(), &ProductManager::getInstance());
    vector<string> args = {"1", "xyz"};
    EXPECT_TRUE(command.validate(args)); // validate passes
    EXPECT_THROW(command.execute(args), invalid_argument); // stoi fails
}

TEST_F(AddCommandTest, ExecuteCreatesUserIfNotExists) {
    AddCommand command(&UserManager::getInstance(), &ProductManager::getInstance());
    vector<string> args = {"10", "100"};
    EXPECT_TRUE(command.validate(args));
    command.execute(args);
    User* user = UserManager::getInstance().getUser(10);
    ASSERT_NE(user, nullptr);
    EXPECT_EQ(user->getId(), 10);
    EXPECT_EQ(user->getName(), "User-10");
    EXPECT_EQ(user->getProductsWatched().size(), 1u);
    EXPECT_EQ(user->getProductsWatched()[0].getId(), 100);
    delete user;
}

TEST_F(AddCommandTest, ExecuteCreatesProductIfNotExists) {
    UserManager::getInstance().addUser(11, "Dave");
    AddCommand command(&UserManager::getInstance(), &ProductManager::getInstance());
    vector<string> args = {"11", "200"};
    EXPECT_TRUE(command.validate(args));
    command.execute(args);
    Product* product = ProductManager::getInstance().getProduct(200);
    ASSERT_NE(product, nullptr);
    EXPECT_EQ(product->getId(), 200);
    EXPECT_EQ(product->getName(), "Product-200");
    // Price is random, just check it's set
    EXPECT_GE(product->getPrice(), 0.0);
    EXPECT_LE(product->getPrice(), 999.0);
    User* user = UserManager::getInstance().getUser(11);
    ASSERT_NE(user, nullptr);
    EXPECT_EQ(user->getProductsWatched().size(), 1u);
    EXPECT_EQ(user->getProductsWatched()[0].getId(), 200);
    delete user;
    delete product;
}

TEST_F(AddCommandTest, ExecuteCreatesBothUserAndProductIfNotExist) {
    AddCommand command(&UserManager::getInstance(), &ProductManager::getInstance());
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
    delete user;
    delete product;
}

TEST_F(AddCommandTest, ExecuteAddsProductsToUser) {
    UserManager::getInstance().addUser(3, "Charlie");
    AddCommand command(&UserManager::getInstance(), &ProductManager::getInstance());
    vector<string> args = {"3", "100", "101"};
    EXPECT_TRUE(command.validate(args));
    command.execute(args);
    User* user = UserManager::getInstance().getUser(3);
    ASSERT_NE(user, nullptr);
    EXPECT_EQ(user->getProductsWatched().size(), 2u);
    EXPECT_EQ(user->getProductsWatched()[0].getId(), 100);
    EXPECT_EQ(user->getProductsWatched()[1].getId(), 101);
}

TEST_F(AddCommandTest, GetDescriptionReturnsExpectedString) {
    AddCommand command(&UserManager::getInstance(), &ProductManager::getInstance());
    EXPECT_EQ(command.getDescription(), "add [userId] [productId1] [productId2] ...");
}
