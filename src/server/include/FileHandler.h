#ifndef FILE_HANDLER_H
#define FILE_HANDLER_H
#include "UserManager.h"
#include "ProductManager.h"

class FileHandler : public IDataHandler {
    private:
        std::string const usersFile = "data/users.txt";
        std::string const productsFile = "data/products.txt";
        UserManager& userManager = UserManager::getInstance(this);
        ProductManager& productManager = ProductManager::getInstance(this);

        //helping methods for parsing and writing data
        std::string serializeUser(const User& user);
        std::string serializeProduct(const Product& product);
        void deserializeUser(const std::string& line);
        void deserializeProduct(const std::string& line);

    public:
        FileHandler();
        std::vector<User> loadUsers() override;
        void saveUser(const User& user) override;
        void deleteUser(int userId) override;
        void updateUser(const User& user) override;

        std::vector<Product> loadProducts() override;
        void saveProduct(const Product& product) override;
        void deleteProduct(int productId) override;
        void updateProduct(const Product& product) override;
};

#endif