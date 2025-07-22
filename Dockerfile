# Stage 1: Build the application
# Use Node.js v20.18.0 to match local development
FROM node:20.18.0-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production image
# Use Node.js v20.18.0 to match local development
FROM node:20.18.0-alpine AS runner

# Install PM2 globally
RUN npm install -g pm2

# Set working directory
WORKDIR /app

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy PM2 ecosystem file
COPY ecosystem.config.js ./

# Create logs directory with proper permissions
RUN mkdir -p /app/logs && chown -R nextjs:nodejs /app/logs

# Change ownership to nextjs user
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start PM2 with ecosystem file
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
