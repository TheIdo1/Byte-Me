#include "gtest/gtest.h"
#include "../src/server/include/DeleteCommand.h"
#include "../src/server/include/Console.h"
#include "../src/server/include/StatusCode.h" 
#include <vector>
#include <string>
#include <sstream>

// =====================================================================
// FAKES & MOCKS FOR DEPENDENCIES
// =====================================================================

// Fake implementation of IDataHandler to track if methods were called
class FakeDataHandlerTestDeleteCommand : public IDataHandler {
public:
    int deletedUserId = -1;
    bool userSaved = false;

    void deleteUser(int userId) override {
        deletedUserId = userId;
    }

    void saveUser(const User& user) override {
        userSaved = true;
    }
    
    // Empty implementations for pure virtual methods
    void saveProduct(const Product& product) override {}
    std::vector<User> loadUsers() override { return {}; }
    std::vector<Product> loadProducts() override { return {}; }
    void deleteProduct(int id) override {}
};

// =====================================================================
// VALIDATION TESTS
// =====================================================================

TEST(DeleteCommandTest, ValidateReturnsTrueForValidArgs) {
    FakeDataHandlerTestDeleteCommand fakeDataHandler;
    UserManager& userMgr = UserManager::getInstance(&fakeDataHandler);
    ProductManager& prodMgr = ProductManager::getInstance(&fakeDataHandler);
    
    std::istringstream fakeInput("");
    std::ostringstream fakeOutput;
    Console fakeIO(fakeInput, fakeOutput);

    DeleteCommand deleteCmd(userMgr, prodMgr, fakeIO, fakeDataHandler);

    std::vector<std::string> args = {"1", "101"}; 
    EXPECT_TRUE(deleteCmd.validate(args));
}

TEST(DeleteCommandTest, ValidateReturnsFalseForNotEnoughArgs) {
    FakeDataHandlerTestDeleteCommand fakeDataHandler;
    UserManager& userMgr = UserManager::getInstance(&fakeDataHandler);
    ProductManager& prodMgr = ProductManager::getInstance(&fakeDataHandler);
    
    std::istringstream fakeInput("");
    std::ostringstream fakeOutput;
    Console fakeIO(fakeInput, fakeOutput);

    DeleteCommand deleteCmd(userMgr, prodMgr, fakeIO, fakeDataHandler);

    std::vector<std::string> argsEmpty; 
    EXPECT_FALSE(deleteCmd.validate(argsEmpty));
}

// =====================================================================
// EXECUTION TESTS
// =====================================================================

TEST(DeleteCommandTest, ExecutePrintsBadRequestOnInvalidArgs) {
    FakeDataHandlerTestDeleteCommand fakeDataHandler;
    UserManager& userMgr = UserManager::getInstance(&fakeDataHandler);
    ProductManager& prodMgr = ProductManager::getInstance(&fakeDataHandler);
    
    std::istringstream fakeInput("");
    std::ostringstream fakeOutput;
    Console fakeIO(fakeInput, fakeOutput);

    DeleteCommand deleteCmd(userMgr, prodMgr, fakeIO, fakeDataHandler);

    std::vector<std::string> args = {"1"}; // Invalid: missing product ID
    deleteCmd.execute(args);

    EXPECT_NE(fakeOutput.str().find("400 Bad Request"), std::string::npos);
}

TEST(DeleteCommandTest, ExecutePrintsNotFoundOnInvalidUserIdFormat) {
    FakeDataHandlerTestDeleteCommand fakeDataHandler;
    UserManager& userMgr = UserManager::getInstance(&fakeDataHandler);
    ProductManager& prodMgr = ProductManager::getInstance(&fakeDataHandler);
    
    std::istringstream fakeInput("");
    std::ostringstream fakeOutput;
    Console fakeIO(fakeInput, fakeOutput);

    DeleteCommand deleteCmd(userMgr, prodMgr, fakeIO, fakeDataHandler);

    std::vector<std::string> args = {"not_a_number", "101"}; 
    deleteCmd.execute(args);

    EXPECT_NE(fakeOutput.str().find("404 Not Found"), std::string::npos);
}

TEST(DeleteCommandTest, ExecuteSucceedsWithValidData) {
    FakeDataHandlerTestDeleteCommand fakeDataHandler;
    
    // 1. Get the Singleton instances
    UserManager& userMgr = UserManager::getInstance(&fakeDataHandler);
    ProductManager& prodMgr = ProductManager::getInstance(&fakeDataHandler);
    
    // Clean up product manager state from any previous tests
    prodMgr.cleanUp();
    
    // 2. Inject valid data using your exact header definitions
    userMgr.addUser(1, "Test User");
    prodMgr.addProduct(101, "Test Product", 9.99);

    std::istringstream fakeInput("");
    std::ostringstream fakeOutput;
    Console fakeIO(fakeInput, fakeOutput);

    DeleteCommand deleteCmd(userMgr, prodMgr, fakeIO, fakeDataHandler);

    // 3. Execute the command
    std::vector<std::string> args = {"1", "101"};
    deleteCmd.execute(args);

    // 4. Verify standard output is 204 No Content
    EXPECT_NE(fakeOutput.str().find("204 No Content"), std::string::npos);

    // 5. Verify the fake data handler caught the database updates
    EXPECT_EQ(fakeDataHandler.deletedUserId, 1);
    EXPECT_TRUE(fakeDataHandler.userSaved);
}