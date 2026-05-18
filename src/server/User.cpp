#include "include/User.h"
#include <stdexcept>    
#include <algorithm>

User::User(int id, string name)
    : id(id), name(name), productsWatched() {
    //TODO: make validation in UserManager
    if (id < 0) {
        throw std::invalid_argument("ID cannot be negetive.");
    }
    if (name.empty()) {
        throw std::invalid_argument("Name cannot be empty.");
    }
}

void User::addProductWatched(Product product) {
    //Make sure product does not exist in user's products before adding it.
    for (auto &p : productsWatched){
        if(p == product){
            return;
        }
    }
    productsWatched.push_back(product);
}

void User::removedProductWatched(Product product){
// Find the product in the vector
    auto it = std::find(productsWatched.begin(), productsWatched.end(), product);
    // If it was found (meaning we didn't reach the end of the vector)
    if (it != productsWatched.end()) {
        productsWatched.erase(it); // Delete it!
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

//isValid method
bool User::isValid() const {
    return !(id < 0) && !name.empty();
}


bool User::operator==(const User& other) const {
        return (this->id == other.id) && (this->name == other.name);
}