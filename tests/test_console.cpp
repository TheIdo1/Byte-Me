#include "gtest/gtest.h"
#include "Console.h"
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