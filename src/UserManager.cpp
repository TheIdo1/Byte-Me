#include <User.h>
#include <UserManager.h>
#include <stdexcept>

UserManager::UserManager() {}

void UserManager::createUser(string id, string name, vector<Product>& productsWatched) {
    if (getUserById(id) == nullptr) {
        throw std::invalid_argument("User with the ID " + id + " already exists");
    }
    users[id] = User(id, name, productsWatched);
}

User* UserManager::getUserById(string id) {
    auto it = users.find(id);
    if (it != users.end()) {
        return &(it->second);
    }
    return nullptr;
}