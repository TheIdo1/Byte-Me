#include "../src/include/UserManager.h"
#include "../src/include/User.h"
#include "../src/include/Product.h"
#include "../src/include/ProductManager.h"
#include <gtest/gtest.h>
#include <vector>

using namespace std;

// Test fixture for UserManager tests
class UserManagerTest : public ::testing::Test {
protected:
    void SetUp() override {
        // Add some products to ProductManager for testing
        ProductManager::getInstance().addProduct(1, "Laptop", 999.99);
        ProductManager::getInstance().addProduct(2, "Mouse", 29.99);
        ProductManager::getInstance().addProduct(3, "Keyboard", 49.99);
    }

    void TearDown() override {
        // Cleanup if needed
    }
};

// Test getInstance
TEST_F(UserManagerTest, GetInstance) {
    UserManager& instance1 = UserManager::getInstance();
    UserManager& instance2 = UserManager::getInstance();
    EXPECT_EQ(&instance1, &instance2);
}

// Test addUser
TEST_F(UserManagerTest, AddUser) {
    UserManager& um = UserManager::getInstance();

    // Add a user
    EXPECT_NO_THROW(um.addUser(101, "Alice"));
    
    // Check if user was added
    User* user = um.getUser(101);
    ASSERT_NE(user, nullptr);
    EXPECT_EQ(user->getId(), 101);
    EXPECT_EQ(user->getName(), "Alice");
    EXPECT_TRUE(user->getProductsWatched().empty());
    delete user;
}

// Test getUser
TEST_F(UserManagerTest, GetUser) {
    UserManager& um = UserManager::getInstance();
    um.addUser(102, "Bob");
    
    User* user = um.getUser(102);
    ASSERT_NE(user, nullptr);
    EXPECT_EQ(user->getId(), 102);
    EXPECT_EQ(user->getName(), "Bob");
    EXPECT_TRUE(user->getProductsWatched().empty());
    delete user;
    
    // Test non-existent user
    User* nonUser = um.getUser(999);
    EXPECT_EQ(nonUser, nullptr);
}

// Test removeUser
TEST_F(UserManagerTest, RemoveUser) {
    UserManager& um = UserManager::getInstance();
    um.addUser(103, "Charlie");
    
    // Verify user exists
    EXPECT_NE(um.getUser(103), nullptr);
    
    // Remove user
    EXPECT_NO_THROW(um.removeUser(103));
    
    // Verify user is removed
    EXPECT_EQ(um.getUser(103), nullptr);
}

// Test getAllUsers
TEST_F(UserManagerTest, GetAllUsers) {
    UserManager& um = UserManager::getInstance();
    
    // Add multiple users
    um.addUser(104, "David");
    um.addUser(105, "Eve");
    
    vector<User> allUsers = um.getAllUsers();
    EXPECT_GE(allUsers.size(), 2u);
    
    bool foundDavid = false, foundEve = false;
    for (const auto& user : allUsers) {
        if (user.getId() == 104 && user.getName() == "David") foundDavid = true;
        if (user.getId() == 105 && user.getName() == "Eve") foundEve = true;
    }
    EXPECT_TRUE(foundDavid);
    EXPECT_TRUE(foundEve);
}

// Test User methods (using ProductManager for products)
TEST_F(UserManagerTest, UserMethods) {
    UserManager& um = UserManager::getInstance();
    um.addUser(106, "Frank");
    User* user = um.getUser(106);
    ASSERT_NE(user, nullptr);
    
    EXPECT_EQ(user->getId(), 106);
    EXPECT_EQ(user->getName(), "Frank");
    EXPECT_TRUE(user->getProductsWatched().empty());
    
    // Get product from ProductManager
    Product* newProduct = ProductManager::getInstance().getProduct(3);
    ASSERT_NE(newProduct, nullptr);
    user->addProductWatched(*newProduct);
    EXPECT_EQ(user->getProductsWatched().size(), 1u);
    EXPECT_EQ(user->getProductsWatched()[0].getId(), 3);
    
    EXPECT_TRUE(user->isValid());
    delete user;
}

// Test invalid user addition
TEST_F(UserManagerTest, AddUserInvalid) {
    UserManager& um = UserManager::getInstance();
    EXPECT_THROW(um.addUser(-1, "Invalid"), invalid_argument);
    EXPECT_THROW(um.addUser(107, ""), invalid_argument);
}
