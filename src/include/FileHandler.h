#ifndef FILE_HANDLER_H
#define FILE_HANDLER_H
#include "UserManager.h"
#include "ProductManager.h"

class FileHandler : public IDataHandler {
    private:
        std::string const usersFile = "src/data/users.txt";
        std::string const productsFile = "src/data/products.txt";
        UserManager& userManager = UserManager::getInstance(this);
        ProductManager& productManager = ProductManager::getInstance(this);
        //helping methods for parsing and writing data
        std::string serializeUser(User& user);
        std::string serializeProduct(Product& product);
        User& deserializeUser(std::string str);
        Product& deserializeProduct(std::string str);
    public:
        FileHandler();
        std::vector<User> loadUsers() override;
        void saveUser(const User& user) override;
        void deleteUser(int userId) override;

        std::vector<Product> loadProducts() override;
        void saveProduct(const Product& product) override;
        void deleteProduct(int productId) override;
} 

#endif