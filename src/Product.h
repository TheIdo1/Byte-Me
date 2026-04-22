#pragma once
#include <string>

class Product {
private:
    int id;
    std::string name;
    double price;

public:
    //Constructor
    Product(int id, const std::string& name, double price);

    // Getters
    int getId() const;
    std::string getName() const;
    double getPrice() const;

    // Setters
    void setPrice(double newPrice);

    // logic
    bool isValid() const;
};