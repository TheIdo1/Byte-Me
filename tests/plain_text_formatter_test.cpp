#include <gtest/gtest.h>
#include "../src/server/include/PlainTextFormatter.h"
#include "../src/server/include/StatusCode.h"
#include <vector>
#include <string>

// Test formatting with an empty payload
TEST(PlainTextFormatterTest, EmptyPayload) {
    PlainTextFormatter formatter;
    std::vector<std::string> payload = {};
    
    std::string result = formatter.format(Http::StatusCode::Created, payload);
    
    // getStatusMessage("201 Created") + trailing "\n"
    EXPECT_EQ(result, "201 Created\n");
}

// Test formatting with a single item in the payload
TEST(PlainTextFormatterTest, SingleItemPayload) {
    PlainTextFormatter formatter;
    std::vector<std::string> payload = {"Item1"};
    
    std::string result = formatter.format(Http::StatusCode::NotFound, payload);
    
    // "404 Not Found" + "\n" + "Item1" + "\n"
    EXPECT_EQ(result, "404 Not Found\nItem1\n");
}

// Test formatting with multiple items (checking space separation)
TEST(PlainTextFormatterTest, MultipleItemsPayload) {
    PlainTextFormatter formatter;
    std::vector<std::string> payload = {"Invalid", "user", "input"};
    
    std::string result = formatter.format(Http::StatusCode::BadRequest, payload);
    
    // "400 Bad Request" + "\n" + "Invalid user input" + "\n"
    EXPECT_EQ(result, "400 Bad Request\nInvalid user input\n");
}

// Test the specific contract for the OK status which inherently includes a newline
TEST(PlainTextFormatterTest, OkStatusExtraNewlineHandling) {
    PlainTextFormatter formatter;
    
    // 1. Without Payload
    std::vector<std::string> emptyPayload = {};
    std::string resultEmpty = formatter.format(Http::StatusCode::OK, emptyPayload);
    
    // getStatusMessage("200 Ok\n") + trailing "\n"
    EXPECT_EQ(resultEmpty, "200 Ok\n\n");
    
    // 2. With Payload
    std::vector<std::string> payload = {"Data", "Cata"};
    std::string resultWithPayload = formatter.format(Http::StatusCode::OK, payload);
    
    // getStatusMessage("200 Ok\n") + payload "\n" + "Data" + trailing "\n"
    EXPECT_EQ(resultWithPayload, "200 Ok\n\nData Cata\n");
}

// Test handling of an unknown/invalid status code
TEST(PlainTextFormatterTest, UnknownStatusCode) {
    PlainTextFormatter formatter;
    std::vector<std::string> payload = {};
    
    // Cast an undefined status code integer to the enum
    std::string result = formatter.format(static_cast<Http::StatusCode>(999), payload);
    
    EXPECT_EQ(result, "Unknown\n");
}