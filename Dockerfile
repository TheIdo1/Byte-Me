# /Dockerfile (Root directory)
FROM gcc:latest

RUN apt-get update && apt-get install -y cmake python3

WORKDIR /usr/src/app

COPY . .

RUN mkdir -p build && cd build && \
    cmake .. && \
    make

# Expose the port
EXPOSE 8080

# Run the server instead of the tests
CMD ["./build/RunServer", "8080"]