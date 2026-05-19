#ifndef PRODUCT_MANAGER_H
#define PRODUCT_MANAGER_H
#include <vector>
#include "Product.h"
#include "IDataHandler.h"

class ProductManager {
private:
    std::vector<Product> products; // list of products
    IDataHandler& dataHandler; // data handler for input/output operations

    //private Const to make it Singleton
    ProductManager(IDataHandler& dataHandler);
public:
    //ensure that the class cannot be copied or assigned
    ProductManager(const ProductManager&) = delete;
    ProductManager& operator=(const ProductManager&) = delete;

    ~ProductManager() = default;

    static ProductManager& getInstance(IDataHandler& handler);

    // add a product to the product list
    void addProduct(int id, const std::string& name, double price);
    // remove a product from the product list by ID
    void removeProduct(int id);
    // get a product from the product list by ID
    Product* getProduct(int id);
    // get all products in the product list
    std::vector<Product> getAllProducts() const;
    // clean up the product list, and reset the data handler - used for testing purposes to reset the state of the ProductManager between tests.
    void cleanUp();
};


#endif