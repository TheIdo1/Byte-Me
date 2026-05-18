#ifndef USER_H
#define USER_H
#include <string>
#include <vector>
#include "Product.h"

using namespace std;

class User {
    friend class UserManager; // UserManager can access private members of User
    private:
        int id;
        string name;
        vector<Product> productsWatched;

        //constructor is private since it's only called by UserManager
        User(int id, string name);
    public:
        //getters
        int getId() const;
        string getName() const; 
        vector<Product> getProductsWatched() const;

        //setters
        void setId(int id);
        void setName(string name);
        void addProductWatched(Product product);
        void removedProductWatched(Product product);
        //checks if valid user
        bool isValid() const;

        bool operator==(const User& other) const;
};
#endif