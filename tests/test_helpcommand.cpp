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


// implementation of ICommand used only in tests to simulate commands
class FakeCommand : public ICommand {
private:
    std::string name;
    std::string argsDesc;
public:
    // Added a constructor with parameters to create commands with different names for the sorting test.
    // Default values are used so that the existing tests continue to work without any changes.
    FakeCommand(std::string n = "fake", std::string a = "command description") 
        : name(n), argsDesc(a) {}

    // no logic needed - not under test
    void execute(const std::vector<std::string>& args) override {}

    // always valid - not under test
    bool validate(const std::vector<std::string>& args) const override { return true; }

    const std::string& getName() const override {
        return name;
    }
    const std::string& getArgsDescription() const override {
        return argsDesc;
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
    EXPECT_NE(fakeOutput.str().find("fake,arguments: command description"), std::string::npos);
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
    EXPECT_EQ(fakeOutput.str(), "HELP\n");
}

// test for alphabetical sorting
TEST(HelpCommandTest, ExecutePrintsCommandsInAlphabeticalOrder) {
    std::istringstream fakeInput("");
    std::ostringstream fakeOutput;
    Console fakeIO(fakeInput, fakeOutput);

    // Create commands with different names in an unsorted order
    FakeCommand cmd1("zebra", "arg1");
    FakeCommand cmd2("apple", "arg2");
    FakeCommand cmd3("mango", ""); // A command without arguments to test the output format as well

    // Insert them into the array in an unsorted order
    std::vector<ICommand*> commands = {&cmd1, &cmd2, &cmd3}; 
    
    // Inside the HelpCommand constructor, the commands should be sorted alphabetically
    HelpCommand help(commands, fakeIO);

    std::vector<std::string> args;
    help.execute(args);

    // Build the expected output: 'apple' first, then 'mango', then 'zebra', and finally 'help'
    std::string expectedOutput = 
        "apple,arguments: arg2\n"
        "mango\n"
        "zebra,arguments: arg1\n"
        "help\n";

    // Verify that the actual printed output matches the expected sorted output exactly
    EXPECT_EQ(fakeOutput.str(), expectedOutput);
}

// test for execute with invalid arguments
TEST(HelpCommandTest, ExecutePrintsBadRequestOnInvalidArgs) {
    std::istringstream fakeInput("");
    std::ostringstream fakeOutput;
    Console fakeIO(fakeInput, fakeOutput);

    std::vector<ICommand*> commands;
    HelpCommand help(commands, fakeIO);

    // Create a vector with an argument to force 'validate' to return false
    std::vector<std::string> args = {"123"}; 
    
    // Execute the command - it should fail validation and print the error
    help.execute(args);

    // Verify that the output is exactly the Bad Request message (Status 400)
    std::string expectedOutput = "400 Bad Request\n";
    EXPECT_EQ(fakeOutput.str(), expectedOutput);
}