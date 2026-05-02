#ifndef USER_MANAGER_H
#define USER_MANAGER_H
#include "User.h"
#include "IDataHandler.h"

class UserManager {
    private:
        vector<User> users;
        IDataHandler* dataHandler;
        //private constructor since it's singleton
        UserManager(IDataHandler* dataHandler = nullptr);
    public:
        //implementing rule of 5 for singleton
        UserManager(const UserManager&) = delete;
        UserManager& operator=(const UserManager&) = delete; 
        UserManager(UserManager&&) = delete; 
        UserManager& operator=(UserManager&&) = delete;
        ~UserManager() = default; 

        //singleton instance getter
        static UserManager& getInstance(IDataHandler* dataHandler = nullptr);

        //manager functionality
        void addUser(int id, string name, vector<Product>& productsWatched);
        void removeUser(int id);
        User* getUser(int id) const;
        vector<User> getAllUsers() const;
};

#endif