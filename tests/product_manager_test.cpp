#include <gtest/gtest.h>
#include <stdexcept>
#include "../src/server/include/ProductManager.h"

// Create a mock data handler
class MockDataHandler : public IDataHandler {
public:
    void saveUser(const User& user) override {}
    std::vector<User> loadUsers() override { return {}; }
    void saveProduct(const Product& product) override {}
    std::vector<Product> loadProducts() override { return {}; }
    void deleteUser(int id) override {}
    void deleteProduct(int id) override {}
};



// Test valid initialization and data retention
TEST(ProductManagerTests, ValidInitialization) {
    MockDataHandler mockHandler;
    ProductManager& manager = ProductManager::getInstance(&mockHandler);
    manager.cleanUp(); // Ensure the product list is empty before the test

    manager.addProduct(1, "Test Product", 9.99);

    // Retrieve the product and check its properties
    Product* retrievedProduct = manager.getProduct(1);
    ASSERT_NE(retrievedProduct, nullptr); // Check that the product was retrieved successfully
    EXPECT_EQ(retrievedProduct->getId(), 1);
    EXPECT_EQ(retrievedProduct->getName(), "Test Product");
    EXPECT_DOUBLE_EQ(retrievedProduct->getPrice(), 9.99);
}

// Test that adding a product with an existing ID throws an error
TEST(ProductManagerTests, AddProductWithExistingIdThrows) {
    MockDataHandler mockHandler;
    ProductManager& manager = ProductManager::getInstance(&mockHandler);
    manager.cleanUp(); // Ensure the product list is empty before the test

    manager.addProduct(1, "Test Product", 9.99);
    
    // Attempt to add another product with the same ID
    EXPECT_THROW(manager.addProduct(1, "Duplicate Product", 19.99), std::invalid_argument);
}

// Test that removing a product works correctly
TEST(ProductManagerTests, RemoveProductWorks) {
    MockDataHandler mockHandler;
    ProductManager& manager = ProductManager::getInstance(&mockHandler);
    manager.cleanUp(); // Ensure the product list is empty before the test

    manager.addProduct(1, "Test Product", 9.99);
    manager.removeProduct(1);

    // Attempt to retrieve the removed product
    Product* retrievedProduct = manager.getProduct(1);
    EXPECT_EQ(retrievedProduct, nullptr); // The product should no longer exist
}

// Test that retrieving a non-existent product returns nullptr
TEST(ProductManagerTests, GetNonExistentProductReturnsNullptr) {
    MockDataHandler mockHandler;
    ProductManager& manager = ProductManager::getInstance(&mockHandler);
    manager.cleanUp(); // Ensure the product list is empty before the test

    Product* retrievedProduct = manager.getProduct(999); // ID that doesn't exist
    EXPECT_EQ(retrievedProduct, nullptr);
}

// Test that getAllProducts returns the correct list of products
TEST(ProductManagerTests, GetAllProductsReturnsCorrectList) {
    MockDataHandler mockHandler;
    ProductManager& manager = ProductManager::getInstance(&mockHandler);
    manager.cleanUp(); // Ensure the product list is empty before the test

    manager.addProduct(1, "Product 1", 9.99);
    manager.addProduct(2, "Product 2", 19.99);

    std::vector<Product> products = manager.getAllProducts();
    EXPECT_EQ(products.size(), 2);
    EXPECT_EQ(products[0].getId(), 1);
    EXPECT_EQ(products[0].getName(), "Product 1");
    EXPECT_DOUBLE_EQ(products[0].getPrice(), 9.99);
    EXPECT_EQ(products[1].getId(), 2);
    EXPECT_EQ(products[1].getName(), "Product 2");
    EXPECT_DOUBLE_EQ(products[1].getPrice(), 19.99);
}

// Test that removing a non-existent product does not throw an error
TEST(ProductManagerTests, RemoveNonExistentProductDoesNotThrow) {
    MockDataHandler mockHandler;
    ProductManager& manager = ProductManager::getInstance(&mockHandler);
    manager.cleanUp(); // Ensure the product list is empty before the test
    // Attempt to remove a product that doesn't exist
    EXPECT_NO_THROW(manager.removeProduct(999)); // ID that doesn't exist
}

// Test that adding a product with invalid data throws an error
TEST(ProductManagerTests, AddProductWithInvalidDataThrows) {
    MockDataHandler mockHandler;
    ProductManager& manager = ProductManager::getInstance(&mockHandler);
    manager.cleanUp(); // Ensure the product list is empty before the test

    // Attempt to add a product with a negative price
    EXPECT_THROW(manager.addProduct(1, "Invalid Product", -10.0), std::invalid_argument);
    
    // Attempt to add a product with an empty name
    EXPECT_THROW(manager.addProduct(2, "", 9.99), std::invalid_argument);
    
    // Attempt to add a product with a non-positive ID
    EXPECT_THROW(manager.addProduct(0, "Invalid Product", 9.99), std::invalid_argument);
}


// TEST UPDATE: Test that updating a product's price works correctly
TEST(ProductManagerTests, UpdateProductPriceWorks) {
    MockDataHandler mockHandler;
    ProductManager& manager = ProductManager::getInstance(&mockHandler);
    manager.cleanUp(); // Ensure the product list is empty before the test

    manager.addProduct(1, "Test Product", 9.99);
    
    // Retrieve the product and update its price
    Product* retrievedProduct = manager.getProduct(1);
    ASSERT_NE(retrievedProduct, nullptr); // Check that the product was retrieved successfully
    retrievedProduct->setPrice(14.99);
    
    // Check that the price was updated correctly
    EXPECT_DOUBLE_EQ(retrievedProduct->getPrice(), 14.99);
}

// TEST UPDATE: Test that updating a product's name works correctly
TEST(ProductManagerTests, UpdateProductNameWorks) {
    MockDataHandler mockHandler;
    ProductManager& manager = ProductManager::getInstance(&mockHandler);
    manager.cleanUp(); // Ensure the product list is empty before the test

    manager.addProduct(1, "Test Product", 9.99);
    
    // Retrieve the product and update its name
    Product* retrievedProduct = manager.getProduct(1);
    ASSERT_NE(retrievedProduct, nullptr); // Check that the product was retrieved successfully
    retrievedProduct->setName("Updated Product");
    
    // Check that the name was updated correctly
    EXPECT_EQ(retrievedProduct->getName(), "Updated Product");
}
