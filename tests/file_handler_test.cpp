#include <gtest/gtest.h>
#include <fstream>
#include <vector>
#include "FileHandler.h"

// Mocking/Defining simple versions of dependencies if not already linked
class FileHandlerTest : public ::testing::Test {
protected:
    FileHandler handler;
    const std::string testUserFile = "test_users.txt";
    const std::string testProductFile = "test_products.txt";

    void SetUp() override {
        // Initialize FileHandler with test file paths
        // Assuming your class allows setting these paths
        // For this example, we assume the class uses these specific strings
    }

    void TearDown() override {
        // Clean up physical files after each test
        std::remove(testUserFile.c_str());
        std::remove(testProductFile.c_str());
    }
};

// --- Serialization Tests ---

TEST_F(FileHandlerTest, SerializeProductReturnsCorrectFormat) {
    Product p(101, "Laptop", 1500.0);
    std::string expected = "101|Laptop|1500.000000"; 
    // Note: std::to_string for doubles often adds trailing zeros
    EXPECT_EQ(handler.serializeProduct(p), expected);
}

TEST_F(FileHandlerTest, SerializeUserWithNoProducts) {
    User u("user123", "Alice", {});
    std::string expected = "user123|Alice|";
    EXPECT_EQ(handler.serializeUser(u), expected);
}

// --- File I/O Tests ---

TEST_F(FileHandlerTest, SaveAndLoadProduct) {
    Product p1(1, "Phone", 999.99);
    
    handler.saveProduct(p1);
    
    std::vector<Product> products = handler.loadProducts();
    
    ASSERT_EQ(products.size(), 1);
    EXPECT_EQ(products[0].getId(), 1);
    EXPECT_EQ(products[0].getName(), "Phone");
    EXPECT_DOUBLE_EQ(products[0].getPrice(), 999.99);
}

TEST_F(FileHandlerTest, DeleteProductRemovesSpecificEntry) {
    Product p1(1, "Phone", 500.0);
    Product p2(2, "Tablet", 300.0);
    
    handler.saveProduct(p1);
    handler.saveProduct(p2);
    
    handler.deleteProduct(1);
    
    std::vector<Product> products = handler.loadProducts();
    
    ASSERT_EQ(products.size(), 1);
    EXPECT_EQ(products[0].getId(), 2);
    EXPECT_EQ(products[0].getName(), "Tablet");
}

// --- Edge Cases ---

TEST_F(FileHandlerTest, LoadFromNonExistentFileReturnsEmpty) {
    // Ensure file doesn't exist
    std::remove("non_existent.txt");
    
    std::vector<User> users = handler.loadUsers();
    EXPECT_TRUE(users.empty());
}

TEST_F(FileHandlerTest, DeserializeInvalidUserReturnsNull) {
    std::string corruptedLine = "invalid|data|format|too|many|pipes";
    User* result = handler.deserializeUser(corruptedLine);
    EXPECT_EQ(result, nullptr);
}