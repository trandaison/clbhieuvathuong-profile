# Docker Deployment Guide

This guide explains how to deploy the CLB Hiến Máu Profile application using Docker and PM2.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ (for local development)
- Git

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd clbhieuvathuong-profile
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

3. **Deploy with Docker**
   ```bash
   npm run deploy
   # OR manually:
   docker-compose up -d
   ```

4. **Access the application**
   - Application: http://localhost:5000
   - Health check: http://localhost:5000/api/health

## Available Scripts

### Docker Commands
- `npm run docker:build` - Build Docker image
- `npm run docker:up` - Start containers
- `npm run docker:down` - Stop containers
- `npm run docker:logs` - View logs
- `npm run docker:restart` - Restart containers
- `npm run deploy` - Full deployment (build + start)

### PM2 Commands (inside container)
- `npm run pm2:start` - Start PM2 processes
- `npm run pm2:stop` - Stop PM2 processes
- `npm run pm2:restart` - Restart PM2 processes
- `npm run pm2:logs` - View PM2 logs
- `npm run pm2:monit` - Monitor PM2 processes

## Docker Configuration

### Dockerfile Features
- Multi-stage build for optimized image size
- PM2 for process management
- Health checks
- Non-root user for security
- Standalone Next.js build

### Docker Compose Features
- Auto-restart policy
- Health checks
- Resource limits
- Volume mounting for logs
- Network isolation

## PM2 Configuration

The `ecosystem.config.js` file configures:
- Cluster mode with all CPU cores
- Automatic restarts
- Memory limit monitoring
- Logging configuration
- Graceful shutdowns

## Monitoring

### Health Check
The application includes a health check endpoint at `/api/health` that returns:
```json
{
  "status": "healthy",
  "timestamp": "2025-01-20T10:00:00.000Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

### Logs
Logs are stored in the `./logs` directory:
- `combined.log` - All logs
- `out.log` - Standard output
- `error.log` - Error logs

### Docker Logs
```bash
# View real-time logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
```

## Production Deployment

### Environment Variables
Create a `.env.production` file with production values:
```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_production_key
RECAPTCHA_SECRET_KEY=your_production_secret
```

### Reverse Proxy (Nginx)
Example Nginx configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Troubleshooting

### Container Issues
```bash
# Check container status
docker-compose ps

# View container logs
docker-compose logs app

# Access container shell
docker-compose exec app sh
```

### PM2 Issues
```bash
# Inside container
pm2 list
pm2 restart all
pm2 flush  # Clear logs
```

### Application Issues
1. Check health endpoint: `curl http://localhost:5000/api/health`
2. Verify environment variables are set correctly
3. Check application logs in `./logs` directory

## Security

- Application runs as non-root user
- Docker container has resource limits
- Environment variables are properly isolated
- Health checks prevent unhealthy containers from serving traffic

## Performance

- PM2 cluster mode utilizes all CPU cores
- Docker multi-stage build for smaller image size
- Next.js standalone build for optimal performance
- Resource limits prevent memory leaks
