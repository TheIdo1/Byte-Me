#include "include/Product.h"
#include <stdexcept>

Product::Product(int id, const std::string& name, double price) : id(id), name(name), price(price) {
    if (id <= 0) {
        throw std::invalid_argument("ID must be positive.");
    }
    if (name.empty()) {
        throw std::invalid_argument("Name cannot be empty.");
    }
    if (price < 0) {
        throw std::invalid_argument("Price cannot be negative.");
    }
}

//Getters
int Product::getId() const {
    return id;
}
std::string Product::getName() const {
    return name;
}   
double Product::getPrice() const {
    return price;
}   

//Setters
void Product::setPrice(double newPrice) {
    if (newPrice < 0) {
        throw std::invalid_argument("Price cannot be negative.");
    }
    price = newPrice;
}

void Product::setName(const std::string& newName) {
    if (newName.empty()) {
        throw std::invalid_argument("Name cannot be empty.");
    }
    name = newName;
}


//Logic
bool Product::isValid() const {
    return id > 0 && !name.empty() && price >= 0;
}

bool Product::operator==(const Product& other) const {
        return id == other.id && name == other.name && price == other.price;
    }
