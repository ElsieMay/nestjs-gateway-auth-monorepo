# Multi-stage build for NestJS applications
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build both applications
RUN npm run build:gateway && npm run build:auth

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built applications from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Expose ports
EXPOSE 3000 3002

# Default command (can be overridden in docker-compose)
CMD ["npm", "run", "start:prod:gateway"]
