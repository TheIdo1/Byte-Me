cmake_minimum_required(VERSION 3.14)
project(JiraProjectTests)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Fetch Google Test
include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)

set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

# 1. Core Library
# Collect all source files
file(GLOB_RECURSE SOURCES CONFIGURE_DEPENDS "src/*.cpp")

# Exclude main.cpp to prevent multiple main() definitions
list(REMOVE_ITEM SOURCES "${CMAKE_CURRENT_SOURCE_DIR}/src/main.cpp")

# Create the core library
add_library(ProjectCore ${SOURCES})


# 2. Main Application Target
add_executable(RunApp src/main.cpp)
target_link_libraries(RunApp ProjectCore)


# 3. Tests Target
# Collect all test files
file(GLOB_RECURSE TEST_SOURCES CONFIGURE_DEPENDS "tests/*.cpp")

# Create the test executable
add_executable(RunTests ${TEST_SOURCES})

# Link core library and Google Test
target_link_libraries(
  RunTests
  ProjectCore
  gtest_main
)

# Enable CTest discovery
include(GoogleTest)
gtest_discover_tests(RunTests)