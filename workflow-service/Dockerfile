# syntax=docker/dockerfile:1
FROM node:20-alpine
RUN apk add --no-cache curl
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 3000
CMD ["node","server.js"]
