#include <gtest/gtest.h>
#include <fstream>
#include <vector>
#include "../src/include/FileHandler.h"

class FileHandlerTest : public ::testing::Test {
protected:
    FileHandler handler;
    const std::string testUserFile = "test_users.txt";
    const std::string testProductFile = "test_products.txt";

    void SetUp() override {}

    void TearDown() override {
        std::remove(testUserFile.c_str());
        std::remove(testProductFile.c_str());
    }
};

// Verifies a saved product can be read back with the same data
TEST_F(FileHandlerTest, SaveAndLoadProduct) {
    ProductManager& pm = ProductManager::getInstance();
    pm.addProduct(1, "Phone", 999.99);

    handler.saveProduct(*pm.getProduct(1));

    std::vector<Product> products = handler.loadProducts();

    ASSERT_EQ(products.size(), 1);
    EXPECT_EQ(products[0].getId(), 1);
    EXPECT_EQ(products[0].getName(), "Phone");
    EXPECT_DOUBLE_EQ(products[0].getPrice(), 999.99);
}

// Verifies that only the deleted product is removed, leaving others intact
TEST_F(FileHandlerTest, DeleteProductRemovesSpecificEntry) {
    ProductManager& pm = ProductManager::getInstance();
    pm.addProduct(1, "Phone", 500.0);
    pm.addProduct(2, "Tablet", 300.0);

    handler.saveProduct(*pm.getProduct(1));
    handler.saveProduct(*pm.getProduct(2));

    handler.deleteProduct(1);

    std::vector<Product> products = handler.loadProducts();

    ASSERT_EQ(products.size(), 1);
    EXPECT_EQ(products[0].getId(), 2);
    EXPECT_EQ(products[0].getName(), "Tablet");
}

// Verifies loadUsers returns empty when the data file doesn't exist
TEST_F(FileHandlerTest, LoadFromNonExistentFileReturnsEmpty) {
    std::vector<User> users = handler.loadUsers();
    EXPECT_TRUE(users.empty());
}
