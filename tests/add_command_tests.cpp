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
    AddCommand command;
    vector<string> args = {"1"};
    EXPECT_FALSE(command.validate(args));
}

TEST_F(AddCommandTest, ReturnsFalseWhenUserIdIsInvalid) {
    AddCommand command;
    vector<string> args = {"abc", "100"};
    EXPECT_FALSE(command.validate(args));
}

TEST_F(AddCommandTest, ReturnsFalseWhenUserDoesNotExist) {
    AddCommand command;
    vector<string> args = {"1", "100"};
    EXPECT_FALSE(command.validate(args));
}

TEST_F(AddCommandTest, ReturnsFalseWhenProductIdIsInvalid) {
    UserManager::getInstance().addUser(1, "Alice");
    AddCommand command;
    vector<string> args = {"1", "xyz"};
    EXPECT_FALSE(command.validate(args));
}

TEST_F(AddCommandTest, ReturnsFalseWhenProductDoesNotExist) {
    UserManager::getInstance().addUser(2, "Bob");
    AddCommand command;
    vector<string> args = {"2", "999"};
    EXPECT_FALSE(command.validate(args));
}

TEST_F(AddCommandTest, ExecuteAddsProductsToUser) {
    UserManager::getInstance().addUser(3, "Charlie");
    AddCommand command;
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
    AddCommand command;
    EXPECT_EQ(command.getDescription(), "add [userId] [productId1] [productId2] ...");
}
