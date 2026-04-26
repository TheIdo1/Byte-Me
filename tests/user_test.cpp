#include <gtest/gtest.h>
#include "../src/User.h"


TEST(UserTests, InitializationWorks) {
    // Test that a User object can be initialized correctly
    User u(1, "Alice");
    EXPECT_EQ(u.getId(), 1);
    EXPECT_EQ(u.getName(), "Alice");
}

TEST(UserTests, ValidationChecks) {
    // Test that the isValid method correctly identifies valid and invalid users
    User validUser(10, "Bob");
    User invalidUser(-1, "");

    ASSERT_TRUE(validUser.isValid());
    ASSERT_FALSE(invalidUser.isValid());
}

TEST(UserTests, CopyConstructor) {
    // Test that the copy constructor creates an identical User object
    User original(4, "Eve");
    User copy = original;
    EXPECT_EQ(copy.getId(), original.getId());
    EXPECT_EQ(copy.getName(), original.getName());
    EXPECT_TRUE(copy == original);
}
