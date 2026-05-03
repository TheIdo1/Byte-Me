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

    bool validate(const std::vector<std::string>& args) const;

    const std::string& getDescription() const;

private:
    std::string description = "recommend [userid] [productid]";

    UserManager& userManager;
    ProductManager& productManager;
    IOHandler& ioHandler;
};

#endif