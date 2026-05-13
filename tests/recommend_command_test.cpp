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
        capturedOutput = s; // Capture all printed output
    }

    std::string readInput() override { return ""; }
};

// 2. Create a Mock DataHandler to prevent Singleton from crashing or using real files
class MockDataHandlerRecommend : public IDataHandler {
public:
    void saveUser(const User& user) override {}
    std::vector<User> loadUsers() override { return {}; }
    void deleteUser(int userId) override {}

    void saveProduct(const Product& product) override {}
    std::vector<Product> loadProducts() override { return {}; }
    void deleteProduct(int productId) override {}
};

// Global instance to avoid dangling pointers between tests
MockDataHandlerRecommend globalMockHandler;

// Helper function to populate the system exactly as shown in the PDF appendix
void setupTestData(UserManager& um, ProductManager& pm) {
    // Create products (100 to 116)
    for (int i = 100; i <= 116; ++i) {
        pm.addProduct(i, "Product " + std::to_string(i), 10.0);
    }

    // Add users and their watched history based on the exact PDF table
    
    // User 1
    um.addUser(1, "User 1");
    um.getUser(1)->addProductWatched(*pm.getProduct(100)); // 
    um.getUser(1)->addProductWatched(*pm.getProduct(101)); // 
    um.getUser(1)->addProductWatched(*pm.getProduct(102)); // 
    um.getUser(1)->addProductWatched(*pm.getProduct(103)); // 

    // User 2
    um.addUser(2, "User 2");
    um.getUser(2)->addProductWatched(*pm.getProduct(101)); // 
    um.getUser(2)->addProductWatched(*pm.getProduct(102)); // 
    um.getUser(2)->addProductWatched(*pm.getProduct(104)); // 
    um.getUser(2)->addProductWatched(*pm.getProduct(105)); // 
    um.getUser(2)->addProductWatched(*pm.getProduct(106)); // 

    // User 3
    um.addUser(3, "User 3");
    um.getUser(3)->addProductWatched(*pm.getProduct(100)); // 
    um.getUser(3)->addProductWatched(*pm.getProduct(104)); // 
    um.getUser(3)->addProductWatched(*pm.getProduct(105)); // 
    um.getUser(3)->addProductWatched(*pm.getProduct(107)); // 
    um.getUser(3)->addProductWatched(*pm.getProduct(108)); // 

    // User 4
    um.addUser(4, "User 4");
    um.getUser(4)->addProductWatched(*pm.getProduct(101)); // 
    um.getUser(4)->addProductWatched(*pm.getProduct(105)); // 
    um.getUser(4)->addProductWatched(*pm.getProduct(106)); // 
    um.getUser(4)->addProductWatched(*pm.getProduct(107)); // 
    um.getUser(4)->addProductWatched(*pm.getProduct(109)); // 
    um.getUser(4)->addProductWatched(*pm.getProduct(110)); // 

    // User 5
    um.addUser(5, "User 5");
    um.getUser(5)->addProductWatched(*pm.getProduct(100)); // 
    um.getUser(5)->addProductWatched(*pm.getProduct(102)); // 
    um.getUser(5)->addProductWatched(*pm.getProduct(103)); // 
    um.getUser(5)->addProductWatched(*pm.getProduct(105)); // 
    um.getUser(5)->addProductWatched(*pm.getProduct(108)); // 
    um.getUser(5)->addProductWatched(*pm.getProduct(111)); // 

    // User 6
    um.addUser(6, "User 6");
    um.getUser(6)->addProductWatched(*pm.getProduct(100)); // 
    um.getUser(6)->addProductWatched(*pm.getProduct(103)); // 
    um.getUser(6)->addProductWatched(*pm.getProduct(104)); // 
    um.getUser(6)->addProductWatched(*pm.getProduct(110)); // 
    um.getUser(6)->addProductWatched(*pm.getProduct(111)); // 
    um.getUser(6)->addProductWatched(*pm.getProduct(112)); // 
    um.getUser(6)->addProductWatched(*pm.getProduct(113)); // 

    // User 7
    um.addUser(7, "User 7");
    um.getUser(7)->addProductWatched(*pm.getProduct(102)); // 
    um.getUser(7)->addProductWatched(*pm.getProduct(105)); // 
    um.getUser(7)->addProductWatched(*pm.getProduct(106)); // 
    um.getUser(7)->addProductWatched(*pm.getProduct(107)); // 
    um.getUser(7)->addProductWatched(*pm.getProduct(108)); // 
    um.getUser(7)->addProductWatched(*pm.getProduct(109)); // 
    um.getUser(7)->addProductWatched(*pm.getProduct(110)); // 

    // User 8
    um.addUser(8, "User 8");
    um.getUser(8)->addProductWatched(*pm.getProduct(101)); // 
    um.getUser(8)->addProductWatched(*pm.getProduct(104)); // 
    um.getUser(8)->addProductWatched(*pm.getProduct(105)); // 
    um.getUser(8)->addProductWatched(*pm.getProduct(106)); // 
    um.getUser(8)->addProductWatched(*pm.getProduct(109)); // 
    um.getUser(8)->addProductWatched(*pm.getProduct(111)); // 
    um.getUser(8)->addProductWatched(*pm.getProduct(114)); // 

    // User 9
    um.addUser(9, "User 9");
    um.getUser(9)->addProductWatched(*pm.getProduct(100)); // 
    um.getUser(9)->addProductWatched(*pm.getProduct(103)); // 
    um.getUser(9)->addProductWatched(*pm.getProduct(105)); // 
    um.getUser(9)->addProductWatched(*pm.getProduct(107)); // 
    um.getUser(9)->addProductWatched(*pm.getProduct(112)); // 
    um.getUser(9)->addProductWatched(*pm.getProduct(113)); // 
    um.getUser(9)->addProductWatched(*pm.getProduct(115)); // 

    // User 10
    um.addUser(10, "User 10");
    um.getUser(10)->addProductWatched(*pm.getProduct(100)); // 
    um.getUser(10)->addProductWatched(*pm.getProduct(102)); // 
    um.getUser(10)->addProductWatched(*pm.getProduct(105)); // 
    um.getUser(10)->addProductWatched(*pm.getProduct(106)); // 
    um.getUser(10)->addProductWatched(*pm.getProduct(107)); // 
    um.getUser(10)->addProductWatched(*pm.getProduct(109)); // 
    um.getUser(10)->addProductWatched(*pm.getProduct(110)); // 
    um.getUser(10)->addProductWatched(*pm.getProduct(116)); // 
}

// Main test to verify the algorithm's correctness against the PDF example
TEST(RecommendCommandTests, PdfAlgorithmExample) {
    // 1. Initialize managers and Mock IO
    ProductManager& pm = ProductManager::getInstance(&globalMockHandler);
    UserManager& um = UserManager::getInstance(&globalMockHandler); 
    MockIOHandlerRecommend mockIO;

    // 2. Populate the system with test data
    setupTestData(um, pm);

    // 3. Create the command instance with the mocked IOHandler and real managers
    RecommendCommand cmd(um, pm, mockIO);

    // 4. Define the arguments: "recommend 1 104"
    std::vector<std::string> args = {"1", "104"};

    // Ensure the command validates the arguments properly
    ASSERT_TRUE(cmd.validate(args)); 

    // 5. Execute the algorithm - passing the args directly to execute
    // All output should be routed to mockIO.capturedOutput internally
    cmd.execute(args);
    
    // 6. Verify the output matches exactly what is required in the PDF
    // Expected output format: "105 106 111 110 112 113 107 108 109 114"
    EXPECT_NE(mockIO.capturedOutput.find("105 106 111 110 112 113 107 108 109 114"), std::string::npos)
        << "Algorithm failed or output formatting is incorrect. Output was: " << mockIO.capturedOutput;
}

TEST(RecommendCommandTests, tooFewArguments) {
    // 1. Initialize managers and Mock IO
    ProductManager& pm = ProductManager::getInstance(&globalMockHandler);
    UserManager& um = UserManager::getInstance(&globalMockHandler); 
    MockIOHandlerRecommend mockIO = MockIOHandlerRecommend(); 

    // 2. Create the command instance with the mocked IOHandler and real managers
    RecommendCommand cmd(um, pm, mockIO);

    // 3. Define invalid arguments (missing product ID)
    std::vector<std::string> args = {"1"}; 

    // 4. Validate should return false for invalid arguments
    EXPECT_FALSE(cmd.validate(args)) << "Validation should fail for missing product ID.";
}

TEST(RecommendCommandTests, nonExistentUser) {
    // 1. Initialize managers and Mock IO
    ProductManager& pm = ProductManager::getInstance(&globalMockHandler);
    UserManager& um = UserManager::getInstance(&globalMockHandler); 
    MockIOHandlerRecommend mockIO; 

    // 2. Create the command instance with the mocked IOHandler and real managers
    RecommendCommand cmd(um, pm, mockIO);

    // 3. Define arguments with a non-existent user ID
    std::vector<std::string> args = {"recommend", "999", "104"}; 

    // 4. Validate should return false for non-existent user
    EXPECT_FALSE(cmd.validate(args)) << "Validation should fail for non-existent user ID.";
}

TEST(RecommendCommandTests, nonExistentProduct) {
    // 1. Initialize managers and Mock IO
    ProductManager& pm = ProductManager::getInstance(&globalMockHandler);
    UserManager& um = UserManager::getInstance(&globalMockHandler); 
    MockIOHandlerRecommend mockIO; 

    // 2. Create the command instance with the mocked IOHandler and real managers
    RecommendCommand cmd(um, pm, mockIO);

    // 3. Define arguments with a non-existent product ID
    std::vector<std::string> args = {"recommend", "1", "999"}; 

    // 4. Validate should return false for non-existent product
    EXPECT_FALSE(cmd.validate(args)) << "Validation should fail for non-existent product ID.";
}


TEST(RecommendCommandTests, tooManyArguments) {
    // 1. Initialize managers and Mock IO
    ProductManager& pm = ProductManager::getInstance(&globalMockHandler);
    UserManager& um = UserManager::getInstance(&globalMockHandler); 
    MockIOHandlerRecommend mockIO; 

    // 2. Create the command instance with the mocked IOHandler and real managers
    RecommendCommand cmd(um, pm, mockIO);

    // 3. Define invalid arguments (extra argument)
    std::vector<std::string> args = {"recommend", "1", "104", "extra"}; 

    // 4. Validate should return false for too many arguments
    EXPECT_FALSE(cmd.validate(args)) << "Validation should fail for too many arguments.";
}