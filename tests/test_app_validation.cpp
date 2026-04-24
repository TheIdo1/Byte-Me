#include <gtest/gtest.h>
#include "../src/include/App.h"

class AppValidationTest : public ::testing::Test {
protected:
    App app;
};

// help command tests
TEST_F(AppValidationTest, HelpCommandValidation) {
    EXPECT_TRUE(app.isValidCommand("help"));
    EXPECT_FALSE(app.isValidCommand("help 1"));     
}

// add command tests
TEST_F(AppValidationTest, AddCommandValidation) {
    EXPECT_TRUE(app.isValidCommand("add 1 101"));         // valid
    EXPECT_TRUE(app.isValidCommand("add 1 101 102 103")); // valid
    EXPECT_TRUE(app.isValidCommand("add  1   101"));      // valid
    
    EXPECT_FALSE(app.isValidCommand("add 1"));            // invalid - missing productId
    EXPECT_FALSE(app.isValidCommand("add\t1 101"));       // invalid - using tab
    EXPECT_FALSE(app.isValidCommand("add"));              // invalid - no userId
}

// recommand command tests
TEST_F(AppValidationTest, RecommendCommandValidation) {
    // valid
    EXPECT_TRUE(app.isValidCommand("recommend 1 101"));    
    EXPECT_TRUE(app.isValidCommand("recommend  1  101"));

    //invalid
    EXPECT_FALSE(app.isValidCommand("recommend 1"));       
    EXPECT_FALSE(app.isValidCommand("recommend 1 101 102")); 
    EXPECT_FALSE(app.isValidCommand("recommend\t1 101"));  
}

// tests for checking non-numeric userId and product Id
TEST_F(AppValidationTest, NonNumericValidation) {
    // invalid userId abc
    EXPECT_FALSE(app.isValidCommand("add abc 101"));
    
    // invalid productId xyz
    EXPECT_FALSE(app.isValidCommand("recommend 1 xyz"));
}

// general tests
TEST_F(AppValidationTest, UnknownCommandValidation) {
    EXPECT_FALSE(app.isValidCommand("delete 1 101"));      // invalid - command type unrecognizable
    EXPECT_FALSE(app.isValidCommand(""));                 
}