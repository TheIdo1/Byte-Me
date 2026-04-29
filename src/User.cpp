#include "include/User.h"
#include <stdexcept>    

User::User(string id, string name) : id(id), name(name), productsWatched() {
    if (id.empty()) {
        throw std::invalid_argument("ID cannot be empty.");
    }
    if (name.empty()) {
        throw std::invalid_argument("Name cannot be empty.");
    }
}

//Getters
string User::getId() const {
    return id;
}

string User::getName() const {
    return name;
}

vector<Product> User::getProductsWatched() const {
    return productsWatched;
}

//Setters
void User::setId(string id) {
    if (id.empty()) {
        throw std::invalid_argument("ID cannot be empty.");
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
    return !id.empty() && !name.empty();
}


bool User::operator==(const User& other) const {
        return (this->id == other.id) && (this->name == other.name);
}