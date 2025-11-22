module.exports = {
  apps: [
    {
      name: "api-foundesk",
      script: "index.js",
      env: {
        PORT: 3000,
        MONGO_URI: "mongodb+srv://mongo:mongo@cluster0.jfxgglv.mongodb.net/foundesk?retryWrites=true&w=majority",
        MAIL_USER: "cristian.ibanez@foundesk.cl",
        MAIL_PASS: "caiv2409%C",
        FRONTEND_URL: "https://sistema.foundesk.cl"
      }
    }
  ]
}
