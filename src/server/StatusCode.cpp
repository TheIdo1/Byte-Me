#include "include/StatusCode.h"
#include<string>


// some have 1 \n, some have 2, idk this is what the Targil's(2) contract stated.
namespace Http{
    std::string getStatusMessage(Http::StatusCode code){
        switch(code){
            case Http::StatusCode::OK:         return "200 Ok\n\n"; 
            case Http::StatusCode::Created:    return "201 Created\n";
            case Http::StatusCode::NoContent:  return "204 No Content\n";
            case Http::StatusCode::BadRequest: return "400 Bad Request\n";
            case Http::StatusCode::NotFound:   return "404 Not Found\n";
            default:                     return "Unknown\n";
        }
    }
}