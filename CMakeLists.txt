cmake_minimum_required(VERSION 3.14)
project(ByteMe_RecSystem)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# --- Google Test Fetching ---
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/refs/heads/main.zip
)
# For Windows compatibility
set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

include_directories(src/include)

add_executable(run_tests
    tests/test_console.cpp
    tests/test_helpcommand.cpp
    src/Console.cpp
    src/HelpCommand.cpp
)
target_link_libraries(run_tests gtest_main) # gtest_main provides the main() function automatically

enable_testing()
add_test(NAME AllTests COMMAND run_tests)
