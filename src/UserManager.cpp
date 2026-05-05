#include "include/UserManager.h"
#include <stdexcept>

UserManager::UserManager(IDataHandler* dataHandler) : dataHandler(dataHandler) {
    if (dataHandler) {
        users = dataHandler->loadUsers();
    }
}

UserManager& UserManager::getInstance(IDataHandler* dataHandler) {
    static UserManager instance(dataHandler);
    return instance;
}

void UserManager::addUser(int id, string name) {
    //check if user already exists
    for (const auto& user : users) {
        if (user.getId() == id) {
            throw std::invalid_argument("User with this ID already exists.");
        }
    }
    User newUser(id, name);
    if (!newUser.isValid()) {
        throw std::invalid_argument("Invalid user data.");
    }
    users.push_back(newUser);
    if (dataHandler) {
        dataHandler->saveUser(newUser);
    }
}

void UserManager::removeUser(int id) {
    for (auto it = users.begin(); it != users.end(); ++it) {
        if (it->getId() == id) {
            if (dataHandler) {
                dataHandler->deleteUser(id);
            }
            users.erase(it);
            return;
        }
    }
    throw std::invalid_argument("User with this ID does not exist.");
}

User* UserManager::getUser(int id) const {
    for (const auto& user : users) {
        if (user.getId() == id) {
            return new User(user);
        }
    }
    return nullptr;
}

vector<User> UserManager::getAllUsers() const {
    return users;
}