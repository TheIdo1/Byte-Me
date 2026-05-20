#include "include/StatusCode.h"
#include<string>


// some have 1 \n, some have 2, idk this is what the Targil's(2) contract stated.
namespace Http{
    std::string getStatusMessage(Http::StatusCode code){
        switch(code){
            case Http::StatusCode::OK:         return "200 Ok\n"; 
            case Http::StatusCode::Created:    return "201 Created";
            case Http::StatusCode::NoContent:  return "204 No Content";
            case Http::StatusCode::BadRequest: return "400 Bad Request";
            case Http::StatusCode::NotFound:   return "404 Not Found";
            default:                     return "Unknown";
        }
    }
}