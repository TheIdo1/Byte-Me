#include "gtest/gtest.h"
#include "../src/include/HelpCommand.h"  
#include <vector>

// VALIDATE TESTS

// valid case: help command takes no args
TEST(HelpCommandTest, ValidateReturnsTrueForEmptyArgs) {
    std::vector<ICommand*> commands; // empty commands list, not relevant for validate
    HelpCommand help(commands);

    std::vector<std::string> args; // no args - correct usage: "help"
    EXPECT_TRUE(help.validate(args));
}

// invalid case: help command should not accept any args
TEST(HelpCommandTest, ValidateReturnsFalseForNonEmptyArgs) {
    std::vector<ICommand*> commands;
    HelpCommand help(commands);

    std::vector<std::string> args = {"103"}; // "help 103" - invalid
    EXPECT_FALSE(help.validate(args));
}

// invalid case: multiple args should also fail
TEST(HelpCommandTest, ValidateReturnsFalseForMultipleArgs) {
    std::vector<ICommand*> commands;
    HelpCommand help(commands);

    std::vector<std::string> args = {"32", "201"}; // "help 32 201" - invalid
    EXPECT_FALSE(help.validate(args));
}
