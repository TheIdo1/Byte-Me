#include <gtest/gtest.h>
#include <vector>
#include <string>
#include "../src/server/include/RecommendCommand.h"

// Mock IOHandler used to capture command output during the test
class MockIOHandlerRecommend : public IOHandler {
private:
    std::string dummyCmd;
    std::vector<std::string> dummyArgs;

public:
    std::string capturedOutput;
    void print(const std::string& s) override {
        // CRITICAL FIX: Changed from '=' to '+=' so it appends multiple print calls
        // (e.g. printing the algorithm results AND the 204 status code)
        capturedOutput += s; 
    }

    std::string readInput() override { return ""; }
};

// Create a Mock DataHandler to prevent Singleton from crashing or using real files
class MockDataHandlerRecommend : public IDataHandler {
public:
    void saveUser(const User& user) override {}
    void updateUser(const User& user) override {}
    std::vector<User> loadUsers() override { return {}; }
    void deleteUser(int userId) override {}

    void saveProduct(const Product& product) override {}
    std::vector<Product> loadProducts() override { return {}; }
    void deleteProduct(int productId) override {}
};

// Global instance to avoid dangling pointers between tests
MockDataHandlerRecommend globalMockHandler;

// Helper function to populate the system exactly as shown in the PDF appendix.
// It uses a static flag to ensure the database is populated only once per test run.
// This prevents "Product/User already exists" exceptions caused by the Singleton 
// pattern retaining state across multiple tests.
void setupTestData(UserManager& um, ProductManager& pm) {
    // CRITICAL FIX: The static variable is initialized only once.
    // If a subsequent test calls this function again, it will immediately return.
    static bool isInitialized = false;
    if (isInitialized) {
        return; 
    }
    isInitialized = true;
    // Create products (100 to 116)
    for (int i = 100; i <= 116; ++i) {
        pm.addProduct(i, "Product " + std::to_string(i), 10.0);
    }

    // Add users and their watched history based on the exact PDF table
    
    // User 1
    um.addUser(1, "User 1");
    um.getUser(1)->addProductWatched(*pm.getProduct(100)); 
    um.getUser(1)->addProductWatched(*pm.getProduct(101)); 
    um.getUser(1)->addProductWatched(*pm.getProduct(102)); 
    um.getUser(1)->addProductWatched(*pm.getProduct(103)); 

    // User 2
    um.addUser(2, "User 2");
    um.getUser(2)->addProductWatched(*pm.getProduct(101)); 
    um.getUser(2)->addProductWatched(*pm.getProduct(102)); 
    um.getUser(2)->addProductWatched(*pm.getProduct(104)); 
    um.getUser(2)->addProductWatched(*pm.getProduct(105)); 
    um.getUser(2)->addProductWatched(*pm.getProduct(106)); 

    // User 3
    um.addUser(3, "User 3");
    um.getUser(3)->addProductWatched(*pm.getProduct(100)); 
    um.getUser(3)->addProductWatched(*pm.getProduct(104)); 
    um.getUser(3)->addProductWatched(*pm.getProduct(105)); 
    um.getUser(3)->addProductWatched(*pm.getProduct(107)); 
    um.getUser(3)->addProductWatched(*pm.getProduct(108)); 

    // User 4
    um.addUser(4, "User 4");
    um.getUser(4)->addProductWatched(*pm.getProduct(101)); 
    um.getUser(4)->addProductWatched(*pm.getProduct(105)); 
    um.getUser(4)->addProductWatched(*pm.getProduct(106)); 
    um.getUser(4)->addProductWatched(*pm.getProduct(107)); 
    um.getUser(4)->addProductWatched(*pm.getProduct(109)); 
    um.getUser(4)->addProductWatched(*pm.getProduct(110)); 

    // User 5
    um.addUser(5, "User 5");
    um.getUser(5)->addProductWatched(*pm.getProduct(100)); 
    um.getUser(5)->addProductWatched(*pm.getProduct(102)); 
    um.getUser(5)->addProductWatched(*pm.getProduct(103)); 
    um.getUser(5)->addProductWatched(*pm.getProduct(105)); 
    um.getUser(5)->addProductWatched(*pm.getProduct(108)); 
    um.getUser(5)->addProductWatched(*pm.getProduct(111)); 

    // User 6
    um.addUser(6, "User 6");
    um.getUser(6)->addProductWatched(*pm.getProduct(100)); 
    um.getUser(6)->addProductWatched(*pm.getProduct(103)); 
    um.getUser(6)->addProductWatched(*pm.getProduct(104)); 
    um.getUser(6)->addProductWatched(*pm.getProduct(110)); 
    um.getUser(6)->addProductWatched(*pm.getProduct(111)); 
    um.getUser(6)->addProductWatched(*pm.getProduct(112)); 
    um.getUser(6)->addProductWatched(*pm.getProduct(113)); 

    // User 7
    um.addUser(7, "User 7");
    um.getUser(7)->addProductWatched(*pm.getProduct(102)); 
    um.getUser(7)->addProductWatched(*pm.getProduct(105)); 
    um.getUser(7)->addProductWatched(*pm.getProduct(106)); 
    um.getUser(7)->addProductWatched(*pm.getProduct(107)); 
    um.getUser(7)->addProductWatched(*pm.getProduct(108)); 
    um.getUser(7)->addProductWatched(*pm.getProduct(109)); 
    um.getUser(7)->addProductWatched(*pm.getProduct(110)); 

    // User 8
    um.addUser(8, "User 8");
    um.getUser(8)->addProductWatched(*pm.getProduct(101)); 
    um.getUser(8)->addProductWatched(*pm.getProduct(104)); 
    um.getUser(8)->addProductWatched(*pm.getProduct(105)); 
    um.getUser(8)->addProductWatched(*pm.getProduct(106)); 
    um.getUser(8)->addProductWatched(*pm.getProduct(109)); 
    um.getUser(8)->addProductWatched(*pm.getProduct(111)); 
    um.getUser(8)->addProductWatched(*pm.getProduct(114)); 

    // User 9
    um.addUser(9, "User 9");
    um.getUser(9)->addProductWatched(*pm.getProduct(100)); 
    um.getUser(9)->addProductWatched(*pm.getProduct(103)); 
    um.getUser(9)->addProductWatched(*pm.getProduct(105)); 
    um.getUser(9)->addProductWatched(*pm.getProduct(107)); 
    um.getUser(9)->addProductWatched(*pm.getProduct(112)); 
    um.getUser(9)->addProductWatched(*pm.getProduct(113)); 
    um.getUser(9)->addProductWatched(*pm.getProduct(115)); 

    // User 10
    um.addUser(10, "User 10");
    um.getUser(10)->addProductWatched(*pm.getProduct(100)); 
    um.getUser(10)->addProductWatched(*pm.getProduct(102)); 
    um.getUser(10)->addProductWatched(*pm.getProduct(105)); 
    um.getUser(10)->addProductWatched(*pm.getProduct(106)); 
    um.getUser(10)->addProductWatched(*pm.getProduct(107)); 
    um.getUser(10)->addProductWatched(*pm.getProduct(109)); 
    um.getUser(10)->addProductWatched(*pm.getProduct(110)); 
    um.getUser(10)->addProductWatched(*pm.getProduct(116)); 
}

// Main test to verify the algorithm's correctness against the PDF example
TEST(RecommendCommandTests, PdfAlgorithmExample) {
    ProductManager& pm = ProductManager::getInstance(&globalMockHandler);
    UserManager& um = UserManager::getInstance(&globalMockHandler); 
    MockIOHandlerRecommend mockIO;

    setupTestData(um, pm);
    RecommendCommand cmd(um, pm, mockIO);

    std::vector<std::string> args = {"1", "104"};
    ASSERT_TRUE(cmd.validate(args)); 
    cmd.execute(args);
    
    // Verify the output matches exactly what is required in the PDF
    EXPECT_NE(mockIO.capturedOutput.find("105 106 111 110 112 113 107 108 109 114"), std::string::npos)
        << "Algorithm failed or output formatting is incorrect. Output was: " << mockIO.capturedOutput;
}

// TEST UPDATE: Check if the 204 No Content status code is printed on success
TEST(RecommendCommandTests, ExecuteReturns200OnSuccess) {
    ProductManager& pm = ProductManager::getInstance(&globalMockHandler);
    UserManager& um = UserManager::getInstance(&globalMockHandler); 
    MockIOHandlerRecommend mockIO;

    setupTestData(um, pm);
    RecommendCommand cmd(um, pm, mockIO);

    std::vector<std::string> args = {"1", "104"};
    cmd.execute(args);
    
    // Verify the 200 OK message is in the output
    EXPECT_NE(mockIO.capturedOutput.find("200 Ok"), std::string::npos)
        << "Expected 200 OK status code, but got: " << mockIO.capturedOutput;
}

TEST(RecommendCommandTests, tooFewArguments) {
    ProductManager& pm = ProductManager::getInstance(&globalMockHandler);
    UserManager& um = UserManager::getInstance(&globalMockHandler); 
    MockIOHandlerRecommend mockIO; 

    RecommendCommand cmd(um, pm, mockIO);
    std::vector<std::string> args = {"1"}; 

    EXPECT_FALSE(cmd.validate(args)) << "Validation should fail for missing product ID.";
}

// TEST UPDATE: Check that execute prints 400 Bad Request on invalid arguments
TEST(RecommendCommandTests, ExecuteReturns400OnInvalidArgs) {
    ProductManager& pm = ProductManager::getInstance(&globalMockHandler);
    UserManager& um = UserManager::getInstance(&globalMockHandler); 
    MockIOHandlerRecommend mockIO; 

    RecommendCommand cmd(um, pm, mockIO);
    std::vector<std::string> args = {"1"}; // Invalid (too few)
    
    cmd.execute(args);
    EXPECT_NE(mockIO.capturedOutput.find("400 Bad Request"), std::string::npos);
}

// TEST UPDATE: Since validate no longer checks existence, we test execute for 404
TEST(RecommendCommandTests, ExecuteReturns404ForNonExistentUser) {
    ProductManager& pm = ProductManager::getInstance(&globalMockHandler);
    UserManager& um = UserManager::getInstance(&globalMockHandler); 
    MockIOHandlerRecommend mockIO; 

    RecommendCommand cmd(um, pm, mockIO);
    std::vector<std::string> args = {"999", "104"}; // User 999 does not exist

    cmd.execute(args);
    EXPECT_NE(mockIO.capturedOutput.find("404 Not Found"), std::string::npos);
}

// TEST UPDATE: Since validate no longer checks existence, we test execute for 404
TEST(RecommendCommandTests, ExecuteReturns404ForNonExistentProduct) {
    ProductManager& pm = ProductManager::getInstance(&globalMockHandler);
    UserManager& um = UserManager::getInstance(&globalMockHandler); 
    MockIOHandlerRecommend mockIO; 

    RecommendCommand cmd(um, pm, mockIO);
    setupTestData(um, pm); // Populates user 1
    std::vector<std::string> args = {"1", "999"}; // Product 999 does not exist

    cmd.execute(args);
    EXPECT_NE(mockIO.capturedOutput.find("404 Not Found"), std::string::npos);
}

TEST(RecommendCommandTests, tooManyArguments) {
    ProductManager& pm = ProductManager::getInstance(&globalMockHandler);
    UserManager& um = UserManager::getInstance(&globalMockHandler); 
    MockIOHandlerRecommend mockIO; 

    RecommendCommand cmd(um, pm, mockIO);
    // Removed "recommend" from args, testing strict arg length validation
    std::vector<std::string> args = {"1", "104", "extra"}; 

    EXPECT_FALSE(cmd.validate(args)) << "Validation should fail for too many arguments.";
}