#include "gtest/gtest.h"
#include "../src/server/include/CommandParser.h"

// Basic case: command + multiple args
TEST(CommandParserTest, ParserExtractsCmdTypeAndArgs) {
    CommandParser parser;
    parser.parse("recommend 23 103");

    // first token becomes cmdType, remaining tokens become args
    EXPECT_EQ(parser.getCmdType(), "RECOMMEND");
    ASSERT_EQ(parser.getArgs().size(), 2);
    EXPECT_EQ(parser.getArgs()[0], "23");
    EXPECT_EQ(parser.getArgs()[1], "103");
}

// Command with no args (e.g. "help")
TEST(CommandParserTest, ParserHandlesCommandWithNoArgs) {
    CommandParser parser;
    parser.parse("help");

    // single token into cmdType, args must stay empty
    EXPECT_EQ(parser.getCmdType(), "HELP");
    EXPECT_TRUE(parser.getArgs().empty());
}

// Command with a single arg
TEST(CommandParserTest, ParserHandlesSingleArg) {
    CommandParser parser;
    parser.parse("add 42");

    // first token into cmdType, one remaining token into args[0]
    EXPECT_EQ(parser.getCmdType(), "ADD");
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

// =====================================================================
// CASE INSENSITIVITY TESTS (Mixed uppercase and lowercase)
// =====================================================================

// Test mixed case for GET command
TEST(CommandParserTest, ParserHandlesMixedCaseGet) {
    CommandParser parser;
    parser.parse("GeT 1 104");

    // The command should be converted to uppercase
    EXPECT_EQ(parser.getCmdType(), "GET");
    // Arguments should remain untouched
    ASSERT_EQ(parser.getArgs().size(), 2);
    EXPECT_EQ(parser.getArgs()[0], "1");
    EXPECT_EQ(parser.getArgs()[1], "104");
}

// Test mixed case for DELETE command
TEST(CommandParserTest, ParserHandlesMixedCaseDelete) {
    CommandParser parser;
    parser.parse("dElEtE 1 104 105");

    EXPECT_EQ(parser.getCmdType(), "DELETE");
    ASSERT_EQ(parser.getArgs().size(), 3);
    EXPECT_EQ(parser.getArgs()[0], "1");
    EXPECT_EQ(parser.getArgs()[1], "104");
    EXPECT_EQ(parser.getArgs()[2], "105");
}

// Test mixed case for POST command
TEST(CommandParserTest, ParserHandlesMixedCasePost) {
    CommandParser parser;
    parser.parse("pOsT 2 201");

    EXPECT_EQ(parser.getCmdType(), "POST");
    ASSERT_EQ(parser.getArgs().size(), 2);
    EXPECT_EQ(parser.getArgs()[0], "2");
    EXPECT_EQ(parser.getArgs()[1], "201");
}

// Test mixed case for PATCH command
TEST(CommandParserTest, ParserHandlesMixedCasePatch) {
    CommandParser parser;
    parser.parse("PaTcH 3 301 302");

    EXPECT_EQ(parser.getCmdType(), "PATCH");
    ASSERT_EQ(parser.getArgs().size(), 3);
    EXPECT_EQ(parser.getArgs()[0], "3");
    EXPECT_EQ(parser.getArgs()[1], "301");
    EXPECT_EQ(parser.getArgs()[2], "302");
}

// Test edge case: All uppercase (Should remain unchanged)
TEST(CommandParserTest, ParserHandlesAllUpperCase) {
    CommandParser parser;
    parser.parse("PATCH 1 100");

    EXPECT_EQ(parser.getCmdType(), "PATCH");
    ASSERT_EQ(parser.getArgs().size(), 2);
}