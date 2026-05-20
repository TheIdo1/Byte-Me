#include "include/PlainTextFormatter.h"
#include "include/StatusCode.h"

std::string PlainTextFormatter::format(Http::StatusCode code, const std::vector<std::string>& payload) const {
    // Start with the HTTP status message
    std::string result = Http::getStatusMessage(code);
    
    // If there is payload data, add a newline and join the items with spaces
    if (!payload.empty()) {
        // result += "\n";
        for (size_t i = 0; i < payload.size(); ++i) {
            result += payload[i];
            
            // Add a space after every item except the last one
            if (i < payload.size() - 1) {
                result += " ";
            }
        }
    }
    
    // Return the final string with a trailing newline for clean console output
    return result;
}