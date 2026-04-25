#include <string>
#include <vector>
#include "Product.h"

using namespace std;

class User {
    private:
        string id;
        string name;
        vector<Product> productsWatched;
    public:
        //constructor
        User(string id, string name);
        
        //getters
        string getId() const;
        string getName() const; 
        vector<Product> getProductsWatched() const;

        //setters
        void setId(string id);
        void setName(string name);
        void addProductWatched(Product product);

        //checks if valid user
        bool isValid() const;
};