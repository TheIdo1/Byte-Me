# Byte-Me

A CLI-based product recommendation system written in C++17. Given a user and a product they are viewing, it recommends up to 10 other products they might like — using a collaborative filtering algorithm based on shared watch history with similar users.

## Features

- **`add [userId] [productId1] [productId2] ...`** — Record that a user has viewed one or more products. Creates the user or product automatically if they don't exist yet.
- **`recommend [userId] [productId]`** — Output up to 10 recommended product IDs for a user, ranked by collaborative-filtering score, then by product ID ascending.
- **`help`** — Print all available commands and their usage.

## How the recommendation works

1. For the target user, compute a similarity score with every other user (count of shared products watched).
2. Among users who also watched the target product, weight each of their other watched products by the similarity score.
3. Exclude products the target user has already watched, and the target product itself.
4. Return the top 10 results sorted by score descending, then product ID ascending.

## Project structure

```
Byte-Me/
├── src/
│   ├── server/
│   │   ├── main.cpp              # Server entry point
│   │   ├── App.cpp               # Application orchestrator
│   │   ├── TcpServer.cpp         # TCP server (accepts connections)
│   │   ├── SocketHandler.cpp     # Per-client socket I/O
│   │   ├── CommandManager.cpp    # Registers and dispatches commands
│   │   ├── CommandParser.cpp     # Parses raw request strings
│   │   ├── PostCommand.cpp       # POST — add/update user watch history
│   │   ├── PatchCommand.cpp      # PATCH — update user data
│   │   ├── DeleteCommand.cpp     # DELETE — remove user data
│   │   ├── RecommendCommand.cpp  # GET recommend — collaborative filtering
│   │   ├── HelpCommand.cpp       # Help — list available commands
│   │   ├── ProductManager.cpp    # Singleton: manages Product instances
│   │   ├── UserManager.cpp       # Singleton: manages User instances
│   │   ├── Product.cpp           # Product model
│   │   ├── User.cpp              # User model
│   │   ├── FileHandler.cpp       # Loads/saves data to txt files
│   │   ├── Console.cpp           # IOHandler backed by stdin/stdout
│   │   ├── StatusCode.cpp        # HTTP-style status code helpers
│   │   └── include/              # Header files for all of the above
│   └── client/
│       └── main.py               # Python TCP client
├── tests/                        # Google Test unit tests
│   ├── command_manager_test.cpp
│   ├── file_handler_test.cpp
│   ├── patch_command_tests.cpp
│   ├── post_command_tests.cpp
│   ├── product_manager_test.cpp
│   ├── recommend_command_test.cpp
│   ├── socket_handler_test.cpp
│   ├── status_code_test.cpp
│   ├── test_command_parser.cpp
│   ├── test_console.cpp
│   ├── test_delete_command.cpp
│   ├── test_helpcommand.cpp
│   └── user_manager_test.cpp
└── data/
    ├── products.txt              # Persisted product data
    └── users.txt                 # Persisted user data
```

## Building

**Requirements:** CMake ≥ 3.14, a C++17-capable compiler (GCC/Clang).

```bash
mkdir build && cd build
cmake ..
make
```

This produces two binaries inside `build/`:
- `RunApp` — the interactive CLI application
- `RunTests` — the test suite

## Running

```bash
./build/RunApp
```

Example session:

```
add 1 101 102 103
add 2 101 104 105
recommend 1 101
104 105
```

## Running the tests

```bash
./build/RunTests
```

Or via CTest:

```bash
cd build && ctest --output-on-failure
```

## Docker

Build and run the test suite inside a container:

```bash
docker build -t byte-me .
docker run --rm byte-me ./build/RunTests
```

To run Server
```bash
docker run -it --rm -p PORT:PORT byte-me ./build/RunServer PORT
```

And with local data
For Linux / macOS / Git Bash:
```bash
docker run -it --rm -p PORT:PORT -v "$PWD/data:/usr/src/app/data" byte-me ./build/RunServer PORT
```

For Windows (PowerShell):
```bash
docker run -it --rm -p PORT:PORT -v "${PWD}/data:/usr/src/app/data" byte-me ./build/RunServer PORT
```

For Windows (Command Prompt / CMD):
```bash
docker run -it --rm -p PORT:PORT -v "%cd%/data:/usr/src/app/data" byte-me ./build/RunServer PORT
```

To run Client
```bash
docker run -it --rm byte-me python3 src/client/main.py IP PORT
```
for docker localhost
```bash
docker run -it --rm byte-me python3 src/client/main.py host.docker.internal PORT
```

## Data format

Products file (`data/products.txt`):
```
id|name|price
```

Users file (`data/users.txt`):
```
id|name|productId1,productId2,...
```

Both files are read on startup and updated automatically as `add` commands are executed.
