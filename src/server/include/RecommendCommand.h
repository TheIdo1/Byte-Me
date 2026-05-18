#ifndef RECOMMEND_COMMAND_H
#define RECOMMEND_COMMAND_H
#include "ICommand.h"
#include "UserManager.h"
#include "ProductManager.h"
#include "IOHandler.h"
#include <vector>
#include <string>

class RecommendCommand : public ICommand {
public:

    RecommendCommand(UserManager& userManager, ProductManager& productManager, IOHandler& ioHandler);

    void execute(const std::vector<std::string>& args) override;

    bool validate(const std::vector<std::string>& args) const override;

    //description methods
    const std::string& getName() const override;
    const std::string& getArgsDescription() const override;

private:
    //description attributes
    std::string name = "recommend";
    std::string argsDescription = "[userid] [productid]";

    UserManager& userManager;
    ProductManager& productManager;
    IOHandler& ioHandler;
};

#endif