#include "include/FileHandler.h"
#include "include"
#include <iostream>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>

FileHandler::FileHandler() {}

std::vector<User> FileHandler::loadUsers() {
    std::vector<User> users;
    std::ifstream file(usersFile);
    std::string line;
    if (file.is_open()) {
        while (getline(file, line)) {
            std::istringstream iss(line);
            std::string id, name;
            if (!(iss >> id >> name)) { continue; } // Skip malformed lines
            // For simplicity, we are not loading productsWatched here
            users.emplace_back(id, name, std::set<Product>());
        }
    file.close();
    return users;
}
