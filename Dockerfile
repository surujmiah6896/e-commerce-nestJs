# Multi-stage Dockerfile for development and production
FROM node:20-alpine AS development

# Install python, make, g++ for node-gyp
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install development dependencies
RUN npm ci

# Copy source code
COPY . .


EXPOSE 4000

CMD ["npm", "run", "dev"]