# Byte-Me

![byte me wide picture](resources/byteme_wide_picture.png)

Byte-Me is a robust backend system for a food delivery application. It features a modern **Node.js/Express RESTful API** built with an **MVC architecture**, seamlessly integrated with a high-performance **C++17 Recommendation Engine** via TCP sockets. 

Given a user and a product they are viewing, the recommendation engine uses a collaborative filtering algorithm based on shared watch history with similar users to recommend up to 10 other products they might like.

> **Note:** After cloning this repository, you should rename `src/webServer/config/.env.test` to `src/webServer/config/.env`.

**For Tragil2's questions scroll to the bottom of the page.

## System Architecture

The project is divided into three main components:
1. **Web Server (Node.js/Express):** Handles client HTTP requests, manages application logic (Orders, Restaurants, Users, Products, Search, Auth), and stores data using an in-memory MVC approach. 
2. **Recommendation Engine (C++17):** A dedicated TCP server that manages user watch histories and calculates collaborative-filtering scores to provide real-time recommendations.
3. **Internal CLI Client (Python):** A command-line interface for testing and interacting directly with the C++ recommendation engine via sockets.

## Features

### RESTful API (Express MVC)
- **Restaurants & Products:** Full CRUD operations for managing restaurants and their menus.
- **Orders:** Place, update, and track user orders.
- **Users & Authentication:** Register users and generate login tokens.
- **Search:** Case-insensitive search across restaurants and products (by name or description).
- *See `WebServerAPICalls.md` for full API documentation.*

## Features of CPP Reccommendation Engine

- **`post [userId] [productId1] [productId2] ...`** — Record that a user has viewed one or more products. valid only if user doesn't exists yet. Creates the user, and product automatically if it don't exist yet.
- **`patch [userId] [productId1] [productId2] ...`** — Record that a user has viewed one or more products. valid only if user exists. Creates product automatically if it don't exist yet.
- **`delete [userId] [productId1] [productId2] ...`** — delete a product from user viewed list, one or more products.
- **`get [userId] [productId]`** — Output up to 10 recommended product IDs for a user, ranked by collaborative-filtering score, then by product ID ascending.
- **`help`** — Print all available commands and their usage.

### Session Example
```bash
post 1 2 3 4 5
201 Created
post 2 3 4 5 6 7 8
201 Created
get 1 3
200 Ok

6 7 8
help
DELETE,arguments: [userid] [productid1] [productid2] ...
GET,arguments: [userid] [productid]
PATCH,arguments: [userId] [productId1] [productId2] ...
POST,arguments: [userId] [productId1] [productId2] ...
help
```
![run example](resources/run_example.png)

## How the recommendation works

1. For the target user, compute a similarity score with every other user (count of shared products watched).
2. Among users who also watched the target product, weight each of their other watched products by the similarity score.
3. Exclude products the target user has already watched, and the target product itself.
4. Return the top 10 results sorted by score descending, then product ID ascending.

## Project Structure

```text
Byte-Me-main/
├── CMakeLists.txt
├── docker-compose.yml
├── Dockerfile
├── README.md
├── WebServerAPICalls.md
├── data/
│   ├── products.txt
│   └── users.txt
├── resources/
│   └── ... (Images & Logos)
├── src/
│   ├── client/                  # Python CLI Client
│   │   ├── Dockerfile
│   │   └── main.py
│   ├── server/                  # C++ Recommendation Engine (TCP Server)
│   │   ├── include/             # Header files (App, CommandManager, etc.)
│   │   ├── App.cpp
│   │   ├── main.cpp
│   │   └── ... (C++ Source Files)
│   └── webServer/               # Node.js/Express API (MVC)
│       ├── config/              # Environment variables
│       ├── controllers/         # Request handling & logic (orders, products, users...)
│       ├── middleware/          # Data validators & Authentication
│       ├── models/              # In-memory data management
│       ├── routes/              # Express API endpoints mapping
│       ├── services/            # External services (e.g., C++ TCP Socket Service)
│       ├── app.js               # Express entry point
│       ├── package.json
│       └── Dockerfile
└── tests/                       # C++ Unit Tests (Google Test)
```

## Building

Using docker-compose we now need only 3 commands (!!!)

Start servers:
look in docker-compose.yml for commented lines in order to save data locally.

```
docker-compose up -d --build cpp-server web-server
```

Start python client:

```
docker-compose run --rm client
```

Shutdown all:

```
docker-compose down
```

## Q n A
- Q1: Did the fact that command names changed require you to modify code that should be "closed for modification but open for extension"?
- Answer: No! we define our commands names in the command mannager, so no command class was needed to be openned for this chage.
---
- Q2: Did the fact that new commands were added require you to modify code that should be "closed for modification but open for extension"?
- Answer: No! again, thanks to our command mannager class, we add to our map every new command and the rest takes care of itself thanks to our implementations of searching command name in a map instead of using switch case.
---
- Q3: Did the fact that the commands' output changed require you to modify code that should be "closed for modification but open for extension"?
- Answer: unfortunatly yes, because the output was integrated part of our commands, now we implemented IFormatter that takes the HTTP code, and the logical output of the command, and builds an output from it, so if we need to change it in the future again, we just need to implement a new formatter and pass it thorugh main
---
- Q4: Did the fact that input/output now comes from sockets instead of the console require you to modify code that should be "closed for modification but open for extension"?

- Answer: No. we implemented IIOhandler interface, and Console that implementes it in Assignment 1 that prints to the console, for this assignment all we had to do is create SocketHandler that implements IIOHandler and pass it as the IO handler for our App in main.


![byte me logo](resources/byteme_logo.png)