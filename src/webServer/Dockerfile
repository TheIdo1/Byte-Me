# src/webServer/Dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files first to cache dependencies
COPY package*.json ./

# Install node modules
RUN npm install

# Copy the rest of the web server code
COPY . .

EXPOSE 8081

CMD ["node", "app.js"]