#include <gtest/gtest.h>
#include "../src/include/ICommand.h"

class MockCommand : public ICommand {
    public:
        bool called = false;
        //Implementation of the interface method
        void execute () override {
            called = true;
        }
};

// test to ensure the interface can be inherited and executed correctly
TEST(ICommandTest, ContractValidation) {
    MockCommand cmd;
    cmd.execute();
    EXPECT_TRUE(cmd.called);
}