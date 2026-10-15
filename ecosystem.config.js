module.exports = {
  apps: [
    {
      name: "ayurfood-brain",
      script: "ayurfood_api_server.py",
      interpreter: "python3",
      env: {
        PORT: "8001",
        PYTHONUNBUFFERED: "1"
      }
    },
    {
      name: "ayurai-backend",
      script: "server.js",
      env: {
        PORT: "8000",
        AYURFOOD_SERVICE_URL: "http://127.0.0.1:8001"
      }
    }
  ]
};
