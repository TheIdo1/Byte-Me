#include "gtest/gtest.h"
#include "../src/server/include/Console.h"
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
    
    // Verify the line was returned correctly
    std::string result = console.readInput();
    EXPECT_EQ(result, "recommend 23 103");
}

TEST(ConsoleTest, PrintOutputsCorrectly) {
    std::istringstream fakeInput("");
    std::ostringstream fakeOutput;

    Console console(fakeInput, fakeOutput);
    console.print("test output\n");

    EXPECT_EQ(fakeOutput.str(), "test output\n");
}
