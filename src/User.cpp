#include "include/User.h"
#include <stdexcept>    

User::User(int id, string name) : id(id), name(name), productsWatched() {
    //TODO: make validation in UserManager
    if (id < 0) {
        throw std::invalid_argument("ID cannot be negetive.");
    }
    if (name.empty()) {
        throw std::invalid_argument("Name cannot be empty.");
    }
}

//Getters
int User::getId() const {
    return id;
}

string User::getName() const {
    return name;
}

vector<Product> User::getProductsWatched() const {
    return productsWatched;
}

//Setters
void User::setId(int id) {
    if (id < 0) {
        throw std::invalid_argument("ID cannot be negetive.");
    }
    this->id = id;
}

void User::setName(string name) {
    if (name.empty()) {
        throw std::invalid_argument("Name cannot be empty.");
    }
    this->name = name;
}

void User::addProductWatched(Product product) {
    productsWatched.push_back(product);
}

//isValid method
bool User::isValid() const {
    return !(id < 0) && !name.empty();
}


bool User::operator==(const User& other) const {
        return (this->id == other.id) && (this->name == other.name);
}