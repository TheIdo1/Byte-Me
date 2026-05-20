#ifndef PLAIN_TEXT_FORMATTER_H
#define PLAIN_TEXT_FORMATTER_H
#include "IFormatter.h"

class PlainTextFormatter : public IFormatter {
public:
    std::string format(Http::StatusCode code, const std::vector<std::string>& payload) const override;
};
#endif