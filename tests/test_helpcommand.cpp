#include "gtest/gtest.h" 
#include "../src/server/include/HelpCommand.h"
#include "../src/server/include/Console.h"
#include <vector>
#include <string>
#include <sstream>


// VALIDATE TESTS

// valid case: help command takes no args
TEST(HelpCommandTest, ValidateReturnsTrueForEmptyArgs) {
    std::istringstream fakeInput("");
    std::ostringstream fakeOutput;
    Console fakeIO(fakeInput, fakeOutput);

    std::vector<ICommand*> commands;
    HelpCommand help(commands, fakeIO);

    std::vector<std::string> args; // no args - correct usage: "help"
    EXPECT_TRUE(help.validate(args));
}

// invalid case: help command should not accept any args
TEST(HelpCommandTest, ValidateReturnsFalseForNonEmptyArgs) {
    std::istringstream fakeInput("");
    std::ostringstream fakeOutput;
    Console fakeIO(fakeInput, fakeOutput);

    std::vector<ICommand*> commands;
    HelpCommand help(commands, fakeIO);

    std::vector<std::string> args = {"103"}; // "help 103" - invalid
    EXPECT_FALSE(help.validate(args));
}

// invalid case: multiple args should also fail
TEST(HelpCommandTest, ValidateReturnsFalseForMultipleArgs) {
    std::istringstream fakeInput("");
    std::ostringstream fakeOutput;
    Console fakeIO(fakeInput, fakeOutput);

    std::vector<ICommand*> commands;
    HelpCommand help(commands, fakeIO);

    std::vector<std::string> args = {"32", "201"}; // "help 32 201" - invalid
    EXPECT_FALSE(help.validate(args));
}


//implementation of ICommand used only in tests to simulate
class FakeCommand : public ICommand {
public:
    // no logic needed - not under test
    void execute(const std::vector<std::string>& args) override {}

    // always valid - not under test
    bool validate(const std::vector<std::string>& args) const override { return true; }

    // returns a fixed known description so tests can assert on it
    const std::string& getDescription() const override {
        static std::string desc = "fake command description";
        return desc;
    }
};


// execute prints description of each command in the list
TEST(HelpCommandTest, ExecutePrintsAllDescriptions) {
    std::istringstream fakeInput("");
    std::ostringstream fakeOutput;
    Console fakeIO(fakeInput, fakeOutput);

    FakeCommand cmd1, cmd2;
    std::vector<ICommand*> commands = {&cmd1, &cmd2}; // two fake commands with known descriptions
    HelpCommand help(commands, fakeIO);

    //args will be empty list
    std::vector<std::string> args;
    help.execute(args);
   

    // fakeOutput.str().find("fake command description") returns the index where the substring
    // was found, or std::string::npos which is a special "not found" value, if it wasn't.
    // EXPECT_NE checks that the result is NOT npos — meaning the description was printed.
    EXPECT_NE(fakeOutput.str().find("fake command description"), std::string::npos);
}

// execute prints nothing when command list is empty
TEST(HelpCommandTest, ExecutePrintsNothingForEmptyCommandList) {
    std::istringstream fakeInput("");
    std::ostringstream fakeOutput;
    Console fakeIO(fakeInput, fakeOutput);

    std::vector<ICommand*> commands; // empty - no commands registered
    HelpCommand help(commands, fakeIO);

    //args will be empty list
    std::vector<std::string> args;
    help.execute(args);
 

    // help always prints at least itself
    EXPECT_EQ(fakeOutput.str(), "help\n");
}