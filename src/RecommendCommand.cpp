#include "include/RecommendCommand.h"
#include <iostream>
#include <algorithm>
#include <set>
#include <map>


// Constructor with Dependency Injection
RecommendCommand::RecommendCommand(UserManager& userManager, ProductManager& productManager, IOHandler& ioHandler)
    : userManager(userManager), productManager(productManager), ioHandler(ioHandler) {}

// Validation: "recommend [userid] [productid]", aregs[0] = "param1", args[1] = "param2".
bool RecommendCommand::validate(std::vector<std::string> args) const {
    if (args.size() != 2) {
        return false;
    }

    // Check if args[0] and args[1] are valid integers
    try {
        std::stoi(args[0]);
        std::stoi(args[1]);
    } catch (...) {
        return false; // Not numbers
    }
    return true;
}

const std::string& RecommendCommand::getDescription() const {
    return description;
}

void RecommendCommand::execute(std::vector<std::string> args) {
    if (!validate(args)) {
        throw std::invalid_argument("Invalid arguments for recommend command. Usage: recommend [userid] [productid]");
    }

    int targetUserId = std::stoi(args[0]);
    int targetProductId = std::stoi(args[1]);

    User* targetUser = userManager.getUser(targetUserId);
    if (!targetUser) {
        throw std::invalid_argument("User not found.");
    }

    // --- Step 1: Prepare target user's watched products for fast lookup ---
    std::set<int> targetUserWatchedIds;
    for (const auto& product : targetUser->getProductsWatched()) {
        targetUserWatchedIds.insert(product.getId());
    }

    // Map to accumulate the calculated weights for each recommended product (id, weight)
    std::map<int, int> productWeights; 

    // --- Step 2 & 3: Find similar users, check if they watched target product, and calculate weights ---
    std::vector<User> allUsers = userManager.getAllUsers();
    
    for (const auto& otherUser : allUsers) {
        // Skip the target user himself
        if (otherUser.getId() == targetUserId) {
            continue;
        }

        bool watchedTargetProduct = false;
        int similarityScore = 0;
        std::vector<int> otherUserWatchedIds;

        // Analyze what this 'other' user has watched
        for (const auto& product : otherUser.getProductsWatched()) {
            int pid = product.getId();
            otherUserWatchedIds.push_back(pid);
            
            // Check if they watched the target product
            if (pid == targetProductId) {
                watchedTargetProduct = true;
            }

            // Calculate similarity: +1 for every product also watched by the target user
            if (targetUserWatchedIds.count(pid) > 0) {
                similarityScore++;
            }
        }

        // Apply logic: Only consider users who watched the target product AND have a similarity > 0
        if (watchedTargetProduct && similarityScore > 0) {
            // Distribute the similarity score as weight to their other watched products
            for (int pid : otherUserWatchedIds) {
                // Do not recommend the target product itself, or products the target user already watched
                if (pid != targetProductId && targetUserWatchedIds.count(pid) == 0) {
                    productWeights[pid] += similarityScore;
                }
            }
        }
    }

    // If no recommendations found
    if (productWeights.empty()) {
        throw std::invalid_argument("No recommendations found.");
    }

    // --- Step 4: Sort and format the output ---
    // Transfer from map to a vector so we can sort by values (weights)
    std::vector<std::pair<int, int>> sortedRecommendations(productWeights.begin(), productWeights.end());

    // Custom sorting logic as requested in the PDF
    std::sort(sortedRecommendations.begin(), sortedRecommendations.end(),
        [](const std::pair<int, int>& a, const std::pair<int, int>& b) {
            if (a.second != b.second) {
                return a.second > b.second; // Primary: sort by weight (Descending)
            }
            return a.first < b.first;       // Secondary: sort by ID (Ascending)
        });

    // Build the final output string
    std::string output = "";
    for (size_t i = 0; i < sortedRecommendations.size(); ++i) {
        output += std::to_string(sortedRecommendations[i].first);
        if (i < sortedRecommendations.size() - 1) {
            output += " ";
        }
    }

    // Print to IOHandler
    ioHandler.print(output + "\n");
}