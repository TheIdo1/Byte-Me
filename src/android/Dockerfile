FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 8083
CMD ["npx", "expo", "start", "--port", "8083", "--host", "lan"]
