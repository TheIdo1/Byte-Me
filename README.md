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
│   ├── main.cpp              # Entry point
│   ├── App.cpp / App.h       # Application orchestrator
│   ├── CommandManager        # Registers and dispatches commands
│   ├── AddCommand            # "add" command implementation
│   ├── RecommendCommand      # "recommend" command implementation
│   ├── HelpCommand           # "help" command implementation
│   ├── ProductManager        # Singleton: manages Product instances
│   ├── UserManager           # Singleton: manages User instances
│   ├── FileHandler           # Loads/saves data to txt files
│   ├── Console               # IOHandler backed by stdin/stdout
│   └── data/
│       ├── products.txt      # Persisted product data
│       └── users.txt         # Persisted user data
└── tests/                    # Google Test unit tests
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
docker run -it --rm byte-me ./build/RunApp
```

To run from docker with local data (run from project root folder):

**For Linux / macOS / Git Bash:**
```bash
docker run -it -v "$PWD/src/data:/usr/src/app/src/data" byte-me ./build/RunApp
```
**For Windows (PowerShell):**
```bash
docker run -it -v "${PWD}/src/data:/usr/src/app/src/data" byte-me ./build/RunApp
```
**For Windows (Command Prompt / CMD):**
```bash
docker run -it -v "%cd%/src/data:/usr/src/app/src/data" byte-me ./build/RunApp
```

## Data format

Products file (`src/data/products.txt`):
```
id|name|price
```

Users file (`src/data/users.txt`):
```
id|name|productId1,productId2,...
```

Both files are read on startup and updated automatically as `add` commands are executed.
