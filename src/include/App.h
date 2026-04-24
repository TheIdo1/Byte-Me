#ifndef APP_H
#define APP_H
#include <vector>
#include <string>

class App {
    public:
        //constructor
        App () {}
        void run(){
            // implement things
        }

        //TODO - clean the App from validation of command - create a class for command validations
        // version 1: string as argument - used for test purposes
        bool isValidCommand(const std::string& input);

        // version 2: string and vector as arguments - used for real purposes
        bool isValidCommand(const std::string& input, const std::vector<std::string>& tokens);
        private:
        // helpers
        //check if string contains only numeric chars
        bool isNumeric(const std::string& s);
        // the method gets input and empty tokens string vector and extracts the entries of input into the vector
        void inputParseIntoTokens(const std::string& input, std::vector<std::string>& tokens);
};

#endif