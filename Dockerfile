# Use a standard C++ environment
FROM gcc:latest

# Install CMake
RUN apt-get update && apt-get install -y cmake

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy all project files to the container
COPY . .

# Build the project
RUN mkdir -p build && cd build && \
    cmake .. && \
    make

# Run the tests when the container starts
CMD ["./build/run_tests"]