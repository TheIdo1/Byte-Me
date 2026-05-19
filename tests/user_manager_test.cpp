#include "../src/server/include/UserManager.h"
#include "../src/server/include/User.h"
#include "../src/server/include/Product.h"
#include "../src/server/include/ProductManager.h"
#include <gtest/gtest.h>
#include <vector>

using namespace std;

class MockDataHandlerUserTest : public IDataHandler {
public:
    void saveUser(const User&) override {}
    vector<User> loadUsers() override { return {}; }
    void deleteUser(int) override {}
    void updateUser(const User&) override {}
    void saveProduct(const Product&) override {}
    vector<Product> loadProducts() override { return {}; }
    void deleteProduct(int) override {}
    void updateProduct(const Product&) override {}
};

// Test fixture for UserManager tests
class UserManagerTest : public ::testing::Test {
protected:
    MockDataHandlerUserTest mockHandler;

    void SetUp() override {
        auto& pm = ProductManager::getInstance(mockHandler);
        try { pm.addProduct(1, "Laptop", 999.99); } catch (...) {}
        try { pm.addProduct(2, "Mouse", 29.99); } catch (...) {}
        try { pm.addProduct(3, "Keyboard", 49.99); } catch (...) {}
    }

    void TearDown() override {
        for (int id : {1, 2, 3}) {
            try { ProductManager::getInstance(mockHandler).removeProduct(id); } catch (...) {}
        }
        for (int id : {101, 102, 103, 104, 105, 106, 107}) {
            try { UserManager::getInstance(mockHandler).removeUser(id); } catch (...) {}
        }
    }
};

// Test getInstance
TEST_F(UserManagerTest, GetInstance) {
    UserManager& instance1 = UserManager::getInstance(mockHandler);
    UserManager& instance2 = UserManager::getInstance(mockHandler);
    EXPECT_EQ(&instance1, &instance2);
}

// Test addUser
TEST_F(UserManagerTest, AddUser) {
    UserManager& um = UserManager::getInstance(mockHandler);

    // Add a user
    EXPECT_NO_THROW(um.addUser(101, "Alice"));
    
    // Check if user was added
    User* user = um.getUser(101);
    ASSERT_NE(user, nullptr);
    EXPECT_EQ(user->getId(), 101);
    EXPECT_EQ(user->getName(), "Alice");
    EXPECT_TRUE(user->getProductsWatched().empty());
}

// Test getUser
TEST_F(UserManagerTest, GetUser) {
    UserManager& um = UserManager::getInstance(mockHandler);
    um.addUser(102, "Bob");
    
    User* user = um.getUser(102);
    ASSERT_NE(user, nullptr);
    EXPECT_EQ(user->getId(), 102);
    EXPECT_EQ(user->getName(), "Bob");
    EXPECT_TRUE(user->getProductsWatched().empty());

    // Test non-existent user
    User* nonUser = um.getUser(999);
    EXPECT_EQ(nonUser, nullptr);
}

// Test removeUser
TEST_F(UserManagerTest, RemoveUser) {
    UserManager& um = UserManager::getInstance(mockHandler);
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
    UserManager& um = UserManager::getInstance(mockHandler);
    
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
    UserManager& um = UserManager::getInstance(mockHandler);
    um.addUser(106, "Frank");
    User* user = um.getUser(106);
    ASSERT_NE(user, nullptr);
    
    EXPECT_EQ(user->getId(), 106);
    EXPECT_EQ(user->getName(), "Frank");
    EXPECT_TRUE(user->getProductsWatched().empty());
    
    // Get product from ProductManager
    Product* newProduct = ProductManager::getInstance(mockHandler).getProduct(3);
    ASSERT_NE(newProduct, nullptr);
    user->addProductWatched(*newProduct);
    EXPECT_EQ(user->getProductsWatched().size(), 1u);
    EXPECT_EQ(user->getProductsWatched()[0].getId(), 3);

    EXPECT_TRUE(user->isValid());
}

// Test invalid user addition
TEST_F(UserManagerTest, AddUserInvalid) {
    UserManager& um = UserManager::getInstance(mockHandler);
    EXPECT_THROW(um.addUser(-1, "Invalid"), invalid_argument);
    EXPECT_THROW(um.addUser(107, ""), invalid_argument);
}
