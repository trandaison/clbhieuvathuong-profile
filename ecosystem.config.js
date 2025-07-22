module.exports = {
  apps: [
    {
      name: 'clbhieuvathuong-profile',
      script: 'server.js',
      instances: 'max', // Use all available CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // PM2 monitoring and restart options
      min_uptime: '10s',
      max_restarts: 10,
      max_memory_restart: '1G',
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 3000,
      // Health check
      health_check_grace_period: 10000,
    },
  ],
};
