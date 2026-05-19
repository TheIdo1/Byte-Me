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
    void updateUser(const User& user) override {}
    void updateProduct(const Product& product) override {}
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

TEST(DeleteCommandTest, ExecuteSucceedsAndRemovesProductWatch) {
    FakeDataHandlerTestDeleteCommand fakeDataHandler;
    
    // 1. Get the Singleton instances
    UserManager& userMgr = UserManager::getInstance(&fakeDataHandler);
    ProductManager& prodMgr = ProductManager::getInstance(&fakeDataHandler);
    
    prodMgr.cleanUp();
    userMgr.cleanUp();


    // Use unique IDs to avoid conflicts with other tests since Singletons carry over data
    int testUserId = 5;
    int testProdId = 505;

    // 2. Setup: Add a user and a product to the managers
    userMgr.addUser(testUserId, "Test Watcher");
    prodMgr.addProduct(testProdId, "Test Item", 49.99);

    // 3. Setup: Make the user "watch" the product
    User* user = userMgr.getUser(testUserId);
    Product* prod = prodMgr.getProduct(testProdId);
    user->addProductWatched(*prod);

    // Verify pre-condition: The user should now be watching exactly 1 product
    EXPECT_EQ(user->getProductsWatched().size(), 1);

    std::istringstream fakeInput("");
    std::ostringstream fakeOutput;
    Console fakeIO(fakeInput, fakeOutput);

    DeleteCommand deleteCmd(userMgr, prodMgr, fakeIO, fakeDataHandler);

    // 4. Execute the command: DELETE 5 505
    std::vector<std::string> args = {std::to_string(testUserId), std::to_string(testProdId)};
    deleteCmd.execute(args);

    // 5. Verify standard output contains "204 No Content" as requested by the instructions
    EXPECT_NE(fakeOutput.str().find("204 No Content"), std::string::npos);

    // 6. Verify the core logic: The watch was successfully removed from the user object
    EXPECT_EQ(user->getProductsWatched().size(), 0);
}