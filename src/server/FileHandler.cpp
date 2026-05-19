#include "include/FileHandler.h"
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <filesystem>

FileHandler::FileHandler() {
    // Ensure the data directory exists. If it doesn't, create it.
    std::filesystem::create_directories("data");
}
//implementing helping methods for parsing and writing data
string FileHandler::serializeUser(const User& user) {
    std::string products;
    if (!user.getProductsWatched().empty()) {
        for (const auto& product : user.getProductsWatched()) {
            products += std::to_string(product.getId()) + ",";
        }
        products.pop_back();
    }
    return std::to_string(user.getId()) + "|" + user.getName() + "|" + products;
}

string FileHandler::serializeProduct(const Product& product) {
    return std::to_string(product.getId()) + "|" + product.getName() + "|" + std::to_string(product.getPrice());
}

void FileHandler::deserializeUser(const std::string& line) {
    std::stringstream ss(line);
    std::string segment;
    std::vector<std::string> fields;
    //fields seperated by '|', in order: id|name|productId1,productId2,...
    while (std::getline(ss, segment, '|')) {
        fields.push_back(segment);
    }

    if (fields.size() == 3) {
        int userId = std::stoi(fields[0]);
        userManager.addUser(userId, fields[1]);
        std::stringstream productsStream(fields[2]);
        std::string productSegment;
        while (std::getline(productsStream, productSegment, ',')) {
            if (!productSegment.empty()) {
                userManager.getUser(userId)->addProductWatched(*productManager.getProduct(std::stoi(productSegment)));
            }
        }
    }
}

void FileHandler::deserializeProduct(const std::string& line) {
    std::stringstream ss(line);
    std::string segment;
    std::vector<std::string> fields;
    //fields seperated by '|', in order: id|name|price
    while (std::getline(ss, segment, '|')) {
        fields.push_back(segment);
    }

    if (fields.size() == 3) {
        productManager.addProduct(std::stoi(fields[0]), fields[1], std::stod(fields[2]));
    }
}

//implementing class methods
std::vector<User> FileHandler::loadUsers() {
    std::vector<User> users;
    std::ifstream file(usersFile);
    std::string line;
    if (file.is_open()) {
        while (getline(file, line)) {
            if (!line.empty()) {
                deserializeUser(line);
            }
        }
        file.close();
    }
    return userManager.getAllUsers();
}

void FileHandler::saveUser(const User& user) {
    std::ofstream file(usersFile, std::ios::app);
    if (file.is_open()) {
        file << serializeUser(const_cast<User&>(user)) << "\n";
        file.close();
    }
}

void FileHandler::updateUser(const User& user) {
    std::vector<User> users = userManager.getAllUsers();
    std::ofstream outFile(usersFile, std::ios::trunc);
    if (outFile.is_open()) {
        for (const auto& u : users) {
            if (u.getId() == user.getId()) {
                outFile << serializeUser(const_cast<User&>(user)) << "\n";
            } else {
                outFile << serializeUser(const_cast<User&>(u)) << "\n";
            }
        }
        outFile.close();
    }
}

void FileHandler::deleteUser(int userId) {
    std::vector<User> users = userManager.getAllUsers();
    std::ofstream outFile(usersFile, std::ios::trunc); 
    //opens the file in trunc mode to overwrite it with all users except the one with the matching id
    if (outFile.is_open()) {
        for (const auto& user : users) {
            //writes only users that don't match the deleted user's id, effectively removing the user from the file
            if (user.getId() != userId) {
                outFile << serializeUser(const_cast<User&>(user)) << "\n";
            }
        }
        outFile.close();
    }   
}

std::vector<Product> FileHandler::loadProducts() {
    std::vector<Product> products;
    std::ifstream file(productsFile);
    std::string line;
    if (file.is_open()) {
        while (getline(file, line)) {
            if (!line.empty()) {
                deserializeProduct(line);
            }
        }
        file.close();
    }
    return productManager.getAllProducts();
}

void FileHandler::saveProduct(const Product& product) {
    std::ofstream file(productsFile, std::ios::app); // ios::app מוסיף לסוף הקובץ
    if (file.is_open()) {
        file << serializeProduct(const_cast<Product&>(product)) << "\n";
        file.close();
    }
}

void FileHandler::deleteProduct(int productId) {
    std::vector<Product> products = productManager.getAllProducts();
    std::ofstream outFile(productsFile, std::ios::trunc); 
    //opens the file in trunc mode to overwrite it with all products except the one with the matching id
    if (outFile.is_open()) {
        for (const auto& product : products) {
            //writes only products that don't match the deleted product's id, effectively removing the product from the file
            if (product.getId() != productId) {
                outFile << serializeProduct(const_cast<Product&>(product)) << "\n";
            }
        }
        outFile.close();
    }   
}