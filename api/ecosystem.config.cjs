module.exports = {
  apps: [
    {
      name: 'Clicktracking',
      script: 'app.js',
      env: {
        NODE_ENV: 'production',
        NODE_PORT: 4500,
        NODE_PATH: '/',
        PGHOST: 'localhost',
        PGUSER: 'clicktracking',
        PGDATABASE: 'postgres',
        PGPASSWORD: 'NMpV9rgC5EW24SyX',
        PGSCHEMA: 'clicktracking',
        PGPORT: 5432,
        JOB_ROOT: 'jobs',
        FRONTEND_URL: 'https://clicktracking.smd-digital.at/',
      },
      error_file: 'logs/api-error.log',
      out_file: 'logs/api-out.log',
      log_file: 'logs/api-combined.log',
    },
  ],
};
