# Stage 1: Build the application
# Use Node.js v20.18.0 to match local development
FROM node:20.18.0-alpine AS builder

# Set working directory
WORKDIR /app

# Add DNS configuration to handle network issues
RUN echo "nameserver 8.8.8.8" > /etc/resolv.conf
RUN echo "nameserver 8.8.4.4" >> /etc/resolv.conf

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Set environment variables for build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the application with fallback handling
RUN npm run build

# Stage 2: Production image
# Use Node.js v20.18.0 to match local development
FROM node:20.18.0-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# create user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
