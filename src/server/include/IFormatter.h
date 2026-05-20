#ifndef IFORMATTER_H
#define IFORMATTER_H
#include <string>
#include <vector>
#include "StatusCode.h"

class IFormatter {
public:
    virtual ~IFormatter() = default;
    
    // Accepts the status code and a vector of raw data elements
    virtual std::string format(Http::StatusCode code, const std::vector<std::string>& payload) const = 0;
};

#endif