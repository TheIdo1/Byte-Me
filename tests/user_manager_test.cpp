#include "../src/include/UserManager.h"
#include "../src/include/User.h"
#include "../src/include/Product.h"
#include <gtest/gtest.h>
#include <vector>

using namespace std;

// Helper function to create a vector of products
vector<Product> createSampleProducts() {
    vector<Product> products;
    products.push_back(Product(1, "Laptop", 999.99));
    products.push_back(Product(2, "Mouse", 29.99));
    return products;
}

// Test fixture for UserManager tests
class UserManagerTest : public ::testing::Test {
protected:
    void SetUp() override {
        // Reset UserManager if possible, but since singleton, we use unique IDs
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
    vector<Product> products = createSampleProducts();
    
    // Add a user
    EXPECT_NO_THROW(um.addUser(101, "Alice", products));
    
    // Check if user was added
    User* user = um.getUser(101);
    ASSERT_NE(user, nullptr);
    EXPECT_EQ(user->getId(), 101);
    EXPECT_EQ(user->getName(), "Alice");
    EXPECT_EQ(user->getProductsWatched().size(), 2u);
}

// Test getUser
TEST_F(UserManagerTest, GetUser) {
    UserManager& um = UserManager::getInstance();
    vector<Product> products = createSampleProducts();
    um.addUser(102, "Bob", products);
    
    User* user = um.getUser(102);
    ASSERT_NE(user, nullptr);
    EXPECT_EQ(user->getId(), 102);
    EXPECT_EQ(user->getName(), "Bob");
    
    // Test non-existent user
    User* nonUser = um.getUser(999);
    EXPECT_EQ(nonUser, nullptr);
}

// Test removeUser
TEST_F(UserManagerTest, RemoveUser) {
    UserManager& um = UserManager::getInstance();
    vector<Product> products = createSampleProducts();
    um.addUser(103, "Charlie", products);
    
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
    vector<Product> products = createSampleProducts();
    
    // Add multiple users
    um.addUser(104, "David", products);
    um.addUser(105, "Eve", products);
    
    vector<User> allUsers = um.getAllUsers();
    EXPECT_GE(allUsers.size(), 2u); // At least the ones we added
    
    // Check if our users are in the list
    bool foundDavid = false, foundEve = false;
    for (const auto& user : allUsers) {
        if (user.getId() == 104 && user.getName() == "David") foundDavid = true;
        if (user.getId() == 105 && user.getName() == "Eve") foundEve = true;
    }
    EXPECT_TRUE(foundDavid);
    EXPECT_TRUE(foundEve);
}

// Test User methods (since UserManager uses User)
TEST_F(UserManagerTest, UserMethods) {
    UserManager& um = UserManager::getInstance();
    vector<Product> products = createSampleProducts();
    um.addUser(106, "Frank", products);
    User* user = um.getUser(106);
    ASSERT_NE(user, nullptr);
    
    // Test getters
    EXPECT_EQ(user->getId(), 106);
    EXPECT_EQ(user->getName(), "Frank");
    EXPECT_EQ(user->getProductsWatched().size(), 2u);
    
    // Test addProductWatched
    Product newProduct(3, "Keyboard", 49.99);
    user->addProductWatched(newProduct);
    EXPECT_EQ(user->getProductsWatched().size(), 3u);
    
    // Test isValid
    EXPECT_TRUE(user->isValid());
}

// Test invalid user addition (empty products)
TEST_F(UserManagerTest, AddUserInvalid) {
    UserManager& um = UserManager::getInstance();
    vector<Product> emptyProducts;
    
    EXPECT_THROW(um.addUser(107, "InvalidUser", emptyProducts), invalid_argument);
}
