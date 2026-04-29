#ifndef PRODUCT_H
#define PRODUCT_H
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
    void setName(const std::string& newName);

    // logic
    bool isValid() const;
};
#endif