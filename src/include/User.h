#ifndef USER_H
#define USER_H
#include <string>
#include <vector>
#include "Product.h"

using namespace std;

class User {
    private:
        int id;
        string name;
        vector<Product> productsWatched;
    public:
        //constructor
        User(int id, string name);
        
        //getters
        int getId() const;
        string getName() const; 
        vector<Product> getProductsWatched() const;

        //setters
        void setId(int id);
        void setName(string name);
        void addProductWatched(Product product);

        //checks if valid user
        bool isValid() const;

        bool operator==(const User& other) const;
};
#endif