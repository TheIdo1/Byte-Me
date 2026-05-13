#ifndef STATUS_CODE
#define STATUS_CODE
#include <string>

namespace Http{

    enum class StatusCode{
        OK = 200,
        Created = 201,
        NoContent = 204,
        BadRequest = 400,
        NotFound = 404
    };
    
    std::string getStatusMessage(StatusCode code);
}
    
#endif