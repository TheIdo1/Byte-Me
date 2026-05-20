#include "include/ProductManager.h"
#include <stdexcept>
#include <algorithm>

// singleton pattern implementation
ProductManager& ProductManager::getInstance(IDataHandler& handler) {
    static ProductManager instance(handler);
    return instance;
}
// constructor implementation
ProductManager::ProductManager(IDataHandler& handler) : dataHandler(handler) {}

// add a product to the product list, and save it using the data handler.
void ProductManager::addProduct(int id, const std::string& name, double price) {
    for (const auto& product : products) {
        if (product.getId() == id) {
            throw std::invalid_argument("Product with this ID already exists");
        }
    }
    if (id <= 0) {
        throw std::invalid_argument("Product ID must be positive");
    }
    if (name.empty()) {
        throw std::invalid_argument("Product name cannot be empty");
    }
    if (price < 0) {
        throw std::invalid_argument("Product price cannot be negative");
    }
    Product newProduct(id, name, price);
    products.push_back(newProduct);
}

// remove a product from the product list by ID, and delete it using the data handler.
void ProductManager::removeProduct(int id) {
    auto it = std::remove_if(products.begin(), products.end(), [id](const Product& product) {
        return product.getId() == id;
    });

    // check if has any product with the given ID
    if (it != products.end()) {
        dataHandler.deleteProduct(id);
        products.erase(it, products.end());
    }

    // if product with the given ID doesn't exist, do nothing.
    
}


// get a product from the product list by ID
Product* ProductManager::getProduct(int id) {
    for (auto& product : products) {
        if (product.getId() == id) {
            return &product;
        }
    }
    return nullptr; // return nullptr if product with the given ID doesn't exist
}

// get all products in the product list
std::vector<Product> ProductManager::getAllProducts() const {
    return products;
}

// clear all products from the product list, and reset the data handler.
// used for testing purposes to reset the state of the product manager between tests.
void ProductManager::cleanUp() {
    products.clear();
}