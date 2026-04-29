#ifndef IDATA_HANDLER_H
#define IDATA_HANDLER_H
#include <vector>
#include "User.h"
#include "Product.h"

// Interface for handling data operations
class IDataHandler {
    public:
    // Virtual destructor for proper cleanup of derived classes
    virtual ~IDataHandler() = default;
    
    // Pure virtual functions (must be implemented by children)
    virtual void saveUser(const User& user) = 0;
    virtual std::vector<User> loadUsers() = 0;
    
    virtual void saveProduct(const Product& product) = 0;
    virtual std::vector<Product> loadProducts() = 0;
};
#endif