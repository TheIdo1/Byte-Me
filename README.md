# Byte-Me

![byte me wide picture](resources/byteme_wide_picture.png)

A CLI-based product recommendation system written in C++17. Given a user and a product they are viewing, it recommends up to 10 other products they might like — using a collaborative filtering algorithm based on shared watch history with similar users.\

After cloning this git you should rename src\webServer\config\.env.test to src\webServer\config\.env

**For Tragil2's questions scroll to the bottom of the page.

## Features

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

## Project structure

```
Byte-Me/
├── CMakeLists.txt
├── Dockerfile
├── README.md
├── data
│   ├── products.txt
│   └── users.txt
├── dockerignore.txt
├── src
│   ├── client
│   │   └── main.py
│   └── server
│       ├── App.cpp
│       ├── CommandManager.cpp
│       ├── CommandParser.cpp
│       ├── Console.cpp
│       ├── DeleteCommand.cpp
│       ├── FileHandler.cpp
│       ├── HelpCommand.cpp
│       ├── PatchCommand.cpp
│       ├── PostCommand.cpp
│       ├── Product.cpp
│       ├── ProductManager.cpp
│       ├── RecommendCommand.cpp
│       ├── SocketHandler.cpp
│       ├── StatusCode.cpp
│       ├── TcpServer.cpp
│       ├── User.cpp
│       ├── UserManager.cpp
│       ├── include
│       │   ├── App.h
│       │   ├── CommandManager.h
│       │   ├── CommandParser.h
│       │   ├── Console.h
│       │   ├── DeleteCommand.h
│       │   ├── FileHandler.h
│       │   ├── HelpCommand.h
│       │   ├── ICommand.h
│       │   ├── IDataHandler.h
│       │   ├── IOHandler.h
│       │   ├── PatchCommand.h
│       │   ├── PostCommand.h
│       │   ├── Product.h
│       │   ├── ProductManager.h
│       │   ├── RecommendCommand.h
│       │   ├── SocketHandler.h
│       │   ├── StatusCode.h
│       │   ├── TcpServer.h
│       │   ├── User.h
│       │   └── UserManager.h
│       └── main.cpp
└── tests
    ├── command_manager_test.cpp
    ├── file_handler_test.cpp
    ├── patch_command_tests.cpp
    ├── post_command_tests.cpp
    ├── product_manager_test.cpp
    ├── recommend_command_test.cpp
    ├── socket_handler_test.cpp
    ├── status_code_test.cpp
    ├── test_command_parser.cpp
    ├── test_console.cpp
    ├── test_delete_command.cpp
    ├── test_helpcommand.cpp
    └── user_manager_test.cpp
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