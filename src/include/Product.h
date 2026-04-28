#pragma once
#include <string>

class Product {
private:
    int id;
    std::string name;
    double price;
    
    //private Constructor
    Product(int id, const std::string& name, double price);
    //friend class ProductManager to allow it to create products
    friend class ProductManager;

public:

    // Getters
    int getId() const;
    std::string getName() const;
    double getPrice() const;

    // Setters
    void setPrice(double newPrice);
    void setName(const std::string& newName);

    // logic
    bool isValid() const;

    bool operator==(const Product& other) const;
};