#include "gtest/gtest.h"
#include "../src/server/include/CommandParser.h"

// Basic case: command + multiple args
TEST(CommandParserTest, ParserExtractsCmdTypeAndArgs) {
    CommandParser parser;
    parser.parse("recommend 23 103");

    // first token becomes cmdType, remaining tokens become args
    EXPECT_EQ(parser.getCmdType(), "recommend");
    ASSERT_EQ(parser.getArgs().size(), 2);
    EXPECT_EQ(parser.getArgs()[0], "23");
    EXPECT_EQ(parser.getArgs()[1], "103");
}

// Command with no args (e.g. "help")
TEST(CommandParserTest, ParserHandlesCommandWithNoArgs) {
    CommandParser parser;
    parser.parse("help");

    // single token into cmdType, args must stay empty
    EXPECT_EQ(parser.getCmdType(), "help");
    EXPECT_TRUE(parser.getArgs().empty());
}

// Command with a single arg
TEST(CommandParserTest, ParserHandlesSingleArg) {
    CommandParser parser;
    parser.parse("add 42");

    // first token into cmdType, one remaining token into args[0]
    EXPECT_EQ(parser.getCmdType(), "add");
    ASSERT_EQ(parser.getArgs().size(), 1);
    EXPECT_EQ(parser.getArgs()[0], "42");
}

// Empty input — both cmdType and args should be empty
TEST(CommandParserTest, ParserHandlesEmptyInput) {
    CommandParser parser;
    parser.parse("   "); // or empty string ""

    EXPECT_EQ(parser.getCmdType(), "");
    EXPECT_TRUE(parser.getArgs().empty());
}

// Extra spaces between tokens should still parse correctly
TEST(CommandParserTest, ParserHandlesExtraSpacesBetweenTokens) {
    CommandParser parser;
    parser.parse("recommend  23  103");

    // multiple spaces between tokens must be treated as one delimiter
    EXPECT_EQ(parser.getCmdType(), "recommend");
    ASSERT_EQ(parser.getArgs().size(), 2);
    EXPECT_EQ(parser.getArgs()[0], "23");
    EXPECT_EQ(parser.getArgs()[1], "103");
}