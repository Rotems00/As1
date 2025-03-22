module.exports = {
  apps: [
    {
      name: "Movie_Backend",
      script: "./dist/src/app.js",
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
