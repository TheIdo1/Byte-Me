#include <User.h>
#include <map>

class UserManager {
    private:
        map<string, User> users;
    public:
        UserManager();
        void createUser(string id, string name, vector<Product>& productsWatched);
        User* getUserById(string id);
};