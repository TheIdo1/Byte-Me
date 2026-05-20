#include "include/RecommendCommand.h"
#include "include/StatusCode.h"
#include <iostream>
#include <algorithm>
#include <set>
#include <map>


// Constructor with Dependency Injection
RecommendCommand::RecommendCommand(UserManager& userManager, ProductManager& productManager, IOHandler& ioHandler, IFormatter& formatter)
    : userManager(userManager), productManager(productManager), ioHandler(ioHandler), formatter(formatter) {}

// Validation: "recommend [userid] [productid]", aregs[0] = "param1", args[1] = "param2".
bool RecommendCommand::validate(const std::vector<std::string>& args) const {
    if (args.size() != 2) {
        return false;
    }
    return true;
}

//description methods
const std::string& RecommendCommand::getName() const { return name; }
const std::string& RecommendCommand::getArgsDescription() const { return argsDescription; }

void RecommendCommand::execute(const std::vector<std::string>& args) {
    std::string result;
    //validate args before executing, if not valid, do nothing
    //makes sure that user and product exists, and that the args are in the correct format
    if (!validate(args)) {
        result = formatter.format((Http::StatusCode::BadRequest), {});
        ioHandler.print(result);
        return; 
    }

    int targetUserId;
    int targetProductId;

    // Parse arguments to integers. If fails, return Not Found (404)
    try {
        targetUserId = std::stoi(args[0]);
    } catch(const std::exception& e) {
        result = formatter.format((Http::StatusCode::NotFound), {});
        ioHandler.print(result);
        return;
    }

    try {
        targetProductId = std::stoi(args[1]);
    } catch(const std::exception& e) {
        result = formatter.format((Http::StatusCode::NotFound), {});
        ioHandler.print(result);
        return;
    }
    
    // Logical existence checks - if it fails, it's Not Found (404)
    User* targetUser = userManager.getUser(targetUserId);
    if (targetUser == nullptr) {
        result = formatter.format((Http::StatusCode::NotFound), {});
        ioHandler.print(result);
        return; // User does not exist
    }

    if (productManager.getProduct(targetProductId) == nullptr) {
        result = formatter.format((Http::StatusCode::NotFound), {});
        ioHandler.print(result);
        return;  // Product does not exist
    }

    // Step 1: Find similaritys between target and all other users
    // Create a set of product IDs watched by the 
    std::set<int> targetWatchedIds;
    for (const Product& p : targetUser->getProductsWatched()) {
        targetWatchedIds.insert(p.getId());

    }
    std::map<int, int> userSimilarity; // userId -> similarity score
    for (const User& user : userManager.getAllUsers()) {
        if (user.getId() == targetUserId) {
            continue; // Skip the target user
        }

        int similarity = 0;
        for (const Product& p : user.getProductsWatched()) {
            if (targetWatchedIds.count(p.getId())) {
                similarity++;
            }
        }
        userSimilarity[user.getId()] = similarity;
    }

    // Step 2: Find who watched the target product, and add weight to each product they watched based on similarty score.
    std::map<int, int> productScores; // productId -> score
    for (const User& user : userManager.getAllUsers()) {
        if (user.getId() == targetUserId) {
            continue; // Skip the target user
        }

        bool watchedTargetProduct = false;
        for (const Product& p : user.getProductsWatched()) {
            if (p.getId() == targetProductId) {
                watchedTargetProduct = true;
                break;
            }
        }

        if (watchedTargetProduct) {
            int similarity = userSimilarity[user.getId()];
            for (const Product& p : user.getProductsWatched()) {
                //make sure to not recommend on current product and not recommend products the user already watched.
                if (p.getId() != targetProductId && targetWatchedIds.count(p.getId()) == 0) {
                    productScores[p.getId()] += similarity;
                }
            }
        }
    }

    // output up to 10 products with the highest score, sorted by score and then by product ID in accending order
    std::vector<std::pair<int, int>> scoredProducts; // (productId, score)
    for (const auto& entry : productScores) {
        scoredProducts.emplace_back(entry.first, entry.second);
    }

    // Sort by score (descending) and then by product ID (descending)
    std::sort(scoredProducts.begin(), scoredProducts.end(), [](const std::pair<int, int>& a, const std::pair<int, int>& b) {
        if (a.second != b.second) {
            return a.second > b.second; // Higher score first
        }
        return a.first < b.first; // Higher ID first
    });

    // Limit to top 10 products
    if (scoredProducts.size() > 10) {
        scoredProducts.resize(10);
    }


    // Build output vector
    std::vector<std::string> rawOutput;
    for(const auto& product : scoredProducts) {
        rawOutput.push_back(std::to_string(product.first));
    }

    // Print to IOHandler

    result = formatter.format((Http::StatusCode::OK), rawOutput);
    ioHandler.print(result);
    
}