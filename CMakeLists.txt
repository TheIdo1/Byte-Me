cmake_minimum_required(VERSION 3.14)
project(JiraProjectTests)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)
FetchContent_Declare(
  googletest
  URL https://github.com/google/googletest/archive/03597a01ee50ed33e9dfd640b249b4be3799d395.zip
)

set(gtest_force_shared_crt ON CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(googletest)

#1. add source files for the main project.
file(GLOB_RECURSE SOURCES CONFIGURE_DEPENDS "src/*.cpp")
add_library(ProjectCore ${SOURCES})

# 2. create an executable for the tests.
file(GLOB_RECURSE TEST_SOURCES CONFIGURE_DEPENDS "tests/*.cpp")
add_executable(
  RunTests
  ${TEST_SOURCES}
)

3. link the test executable with the main project and gtest.
target_link_libraries(
  RunTests
  ProjectCore
  gtest_main
)

#let gtest discover the tests in the executable.
include(GoogleTest)
gtest_discover_tests(RunTests)