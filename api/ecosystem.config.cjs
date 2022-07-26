module.exports = {
  apps: [
    {
      name: 'Mantra',
      script: 'app.js',
      env: {
        DATABASE_URL: 'postgresql://mantra:pNK-5bSADKy05Z-yb3LcLg@free-tier13.aws-eu-central-1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full&options=--cluster%3Dmantra-2566',
        NODE_ENV: 'local',
        NODE_PORT: 4000,
        PGSCHEMA: 'mantra',
      },
      error_file: 'logs/api-error.log',
      out_file: 'logs/api-out.log',
      log_file: 'logs/api-combined.log',
    },
  ],
};
