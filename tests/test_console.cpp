#include "gtest/gtest.h"
#include "../src/include/Console.h"
#include <sstream>

/**
 * This test checks that readInput():
 * 1 reads a full line from the input stream
 * 2 stores it in Console::input
 */
TEST(ConsoleTest, ReadInputStoresInputLine) {
    // Fake input stream instead cin.
    std::istringstream fakeInput("recommend 23 103\n");

    // Fake output stream. neccessery for the Console constructor.
    std::ostringstream fakeOutput;

    // create a Console that reads from fakeInput instead of std::cin.
    Console console(fakeInput, fakeOutput);
    console.readInput();

    // verify the line was stored correctly.
    EXPECT_EQ(console.getInput(), "recommend 23 103");
}


// PARSER TESTS


// Basic case: command + multiple args
TEST(ConsoleTest, ParserExtractsCmdTypeAndArgs) {
    std::istringstream fakeInput("recommend 23 103\n");
    std::ostringstream fakeOutput;
    Console console(fakeInput, fakeOutput);
    console.readInput();
    console.parser();

    // first token becomes cmdType, remaining tokens become args
    EXPECT_EQ(console.getCmdType(), "recommend");
    ASSERT_EQ(console.getArgs().size(), 2);
    EXPECT_EQ(console.getArgs()[0], "23");
    EXPECT_EQ(console.getArgs()[1], "103");
}

// Command with no args (e.g. "help")
TEST(ConsoleTest, ParserHandlesCommandWithNoArgs) {
    std::istringstream fakeInput("help\n");
    std::ostringstream fakeOutput;
    Console console(fakeInput, fakeOutput);
    console.readInput();
    console.parser();

    // single token into cmdType, args must stay empty
    EXPECT_EQ(console.getCmdType(), "help");
    EXPECT_TRUE(console.getArgs().empty());
}

// Command with a single arg
TEST(ConsoleTest, ParserHandlesSingleArg) {
    std::istringstream fakeInput("add 42\n");
    std::ostringstream fakeOutput;
    Console console(fakeInput, fakeOutput);
    console.readInput();
    console.parser();

    // first token into cmdType, one remaining token into args[0]
    EXPECT_EQ(console.getCmdType(), "add");
    ASSERT_EQ(console.getArgs().size(), 1);
    EXPECT_EQ(console.getArgs()[0], "42");
}

// Empty input — both cmdType and args should be empty
TEST(ConsoleTest, ParserHandlesEmptyInput) {
    std::istringstream fakeInput("\n");
    std::ostringstream fakeOutput;
    Console console(fakeInput, fakeOutput);
    console.readInput();
    console.parser();

    EXPECT_EQ(console.getCmdType(), "");
    EXPECT_TRUE(console.getArgs().empty());
}

// Extra spaces between tokens should still parse correctly
TEST(ConsoleTest, ParserHandlesExtraSpacesBetweenTokens) {
    std::istringstream fakeInput("recommend  23  103\n");
    std::ostringstream fakeOutput;
    Console console(fakeInput, fakeOutput);
    console.readInput();
    console.parser();

    // multiple spaces between tokens must be treated as one delimiter
    EXPECT_EQ(console.getCmdType(), "recommend");
    ASSERT_EQ(console.getArgs().size(), 2);
    EXPECT_EQ(console.getArgs()[0], "23");
    EXPECT_EQ(console.getArgs()[1], "103");
}