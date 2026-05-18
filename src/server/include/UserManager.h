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
        void addUser(int id, string name);
        void removeUser(int id);
        User* getUser(int id);
        vector<User> getAllUsers() const;

        // clean up the product list, and reset the data handler - used for testing purposes to reset the state of the ProductManager between tests.
        void cleanUp();
};

#endif