#ifndef APP_H
#define APP_H

#include <string>

class App {
    public:
        //constructor
        App () {}
        void run(){
            // implement things
        }
        // helper: validate input as command
        bool isValidCommand(const std::string& input);
        bool isNumeric(const std::string& s);
};

#endif