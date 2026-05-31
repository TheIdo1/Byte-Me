# src/client/Dockerfile
FROM python:3.9-slim

WORKDIR /usr/src/app

# Copy the client code
COPY . .

# Run the client pointing to the C++ server's Docker Compose name
CMD ["python3", "main.py", "cpp-server", "8080"]