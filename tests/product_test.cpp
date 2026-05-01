#include <gtest/gtest.h>
#include <stdexcept>
#include "../src/include/Product.h"

// Test valid initialization and data retention
TEST(ProductTests, InitializationWorks) {
    Product p(201, "Fizzy Dizzy", 149.90);
    EXPECT_EQ(p.getId(), 201);
    EXPECT_EQ(p.getName(), "Fizzy Dizzy");
    EXPECT_DOUBLE_EQ(p.getPrice(), 149.90);
}

// Test identification of valid vs invalid products
TEST(ProductTests, ValidationChecks) {
    Product validProduct(202, "Shower Chair", 350.0);
    Product invalidProduct(-1, "", 100.0);

    ASSERT_TRUE(validProduct.isValid());
    ASSERT_FALSE(invalidProduct.isValid());
}

// Test that creating a product with a negative price throws an error
TEST(ProductTests, PriceCannotBeNegative) {
    EXPECT_THROW({
        Product p(203, "Hooba Booba", -50.0);
    }, std::invalid_argument);
}

// Test successful price update
TEST(ProductTests, UpdatePriceSuccessfully) {
    Product p(204, "SushiLushi", 1200.0);
    
    p.setPrice(1050.0);
    
    EXPECT_DOUBLE_EQ(p.getPrice(), 1050.0);
}

// Test that updating to a negative price throws an error and keeps old price
TEST(ProductTests, PreventUpdatingToNegativePrice) {
    Product p(205, "Banana", 20.0);
    
    EXPECT_THROW(p.setPrice(-10.0), std::invalid_argument);
    EXPECT_DOUBLE_EQ(p.getPrice(), 20.0);
}