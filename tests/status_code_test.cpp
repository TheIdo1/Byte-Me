#include "gtest/gtest.h"
#include "../src/server/include/StatusCode.h"
#include "../src/server/include/IOHandler.h"

class MockIOHandlerStatusCodeTest : public IOHandler {

    public:
    std::string capturedOutput;
    void print(const std::string& s) override {
        capturedOutput += s; // Capture all printed output
    }
    std::string readInput() override {}
};

TEST(StatusCodeText, getExpectedOutputOK) {
    MockIOHandlerStatusCodeTest mc;
    mc.print(Http::getStatusMessage(Http::StatusCode::OK));
    EXPECT_EQ(mc.capturedOutput, "200 Ok\n\n");
}

TEST(StatusCodeText, getExpectedOutputCreated) {
    MockIOHandlerStatusCodeTest mc;
    mc.print(Http::getStatusMessage(Http::StatusCode::Created));
    EXPECT_EQ(mc.capturedOutput, "201 Created\n");
}

TEST(StatusCodeText, getExpectedOutputNoContent) {
    MockIOHandlerStatusCodeTest mc;
    mc.print(Http::getStatusMessage(Http::StatusCode::NoContent));
    EXPECT_EQ(mc.capturedOutput, "204 No Content\n");
}

TEST(StatusCodeText, getExpectedOutputNotFound) {
    MockIOHandlerStatusCodeTest mc;
    mc.print(Http::getStatusMessage(Http::StatusCode::NotFound));
    EXPECT_EQ(mc.capturedOutput, "404 Not Found\n");
}

TEST(StatusCodeText, getExpectedOutputBadRequest) {
    MockIOHandlerStatusCodeTest mc;
    mc.print(Http::getStatusMessage(Http::StatusCode::BadRequest));
    EXPECT_EQ(mc.capturedOutput, "400 Bad Request\n");
}

