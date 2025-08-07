module.exports = {
  apps: [{
    name: 'mozaika',
    script: 'npm',
    args: 'start',
    cwd: '/home/mozaika/mozaika',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 1,
    exec_mode: 'fork',
    watch: false,
    max_memory_restart: '1G',
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    time: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_restarts: 5,
    min_uptime: '30s'
  }]
}