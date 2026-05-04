#include "include/FileHandler.h"
#include "include"
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>

FileHandler::FileHandler() {}
//implementing hel[ping methods for parsing and writing data
string FileHandler::serializeUser(User& user) {
    strig products;
    if (!user.getProductsWatched().empty()) {
        for (const auto& product : user.getProductsWatched()) {
            products += std::to_string(product.getId()) + ",";
        }
    }
    return user.getId() + "|" + user.getName() + "|" + products;
}

string FileHandler::serializeProduct(Product& product) {
    return std::to_string(product.getId()) + "|" + product.getName() + "|" + std::to_string(product.getPrice());
}

User& FileHandler::deserializeUser(std::string line) {
    std::stringstream ss(line);
    std::string segment;
    std::vector<std::string> fields;
    //fields seperated by '|', in order: id|name|productId1,productId2,...
    while (std::getline(ss, segment, '|')) {
        fields.push_back(segment);
    }

    if (fields.size() == 3) {
        std::set<Product> productsWatched;
        std::stringstream productsStream(fields[2]);
        std::string productSegment;
        while (std::getline(productsStream, productSegment, ',')) {
            productsWatched.insert(productManager.getProduct(productSegment));
        }
        return User(fields[0], fields[1], productsWatched);
    }
    return nullptr;
}

Product& FileHandler::deserializeProduct(std::string line) {
    std::stringstream ss(line);
    std::string segment;
    std::vector<std::string> fields;
    //fields seperated by '|', in order: id|name|price
    while (std::getline(ss, segment, '|')) {
        fields.push_back(segment);
    }

    if (fields.size() == 3) {
        return Product(std::stoi(fields[0]), fields[1], std::stod(fields[2]));
    }
    return nullptr;
}

//implementing class methods
std::vector<User> FileHandler::loadUsers() {
    std::vector<User> users;
    std::ifstream file(usersFile);
    std::string line;
    if (file.is_open()) {
        while (getline(file, line)) {
            if (!line.empty()) {
                users.push_back(deserializeUser(line));
            }
        }
    file.close();
    return users;
    }
}

std::vector<Product> FileHandler::loadProducts() {
    std::vector<Product> products;
    std::ifstream file(productsFile);
    std::string line;
    if (file.is_open()) {
        while (getline(file, line)) {
            if (!line.empty()) {
                products.push_back(deserializeProduct(line));
            }
        }
    file.close();
    return products;
    }
}
