module.exports = {
  apps: [
    {
      name: "api-foundesk",
      script: "index.js",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        //MONGO_URI: "mongodb+srv://mongo:mongo@cluster0.jfxgglv.mongodb.net/foundesk?retryWrites=true&w=majority",
        MONGO_URI: "mongodb://foundeskApp:oshaek3Ooth1odu@192.168.3.103:27017/foundesk?authSource=foundesk",
        MAIL_USER: "cristian.ibanez@foundesk.cl",
        MAIL_PASS: "caiv2409%C",
        FRONTEND_URL: "https://sistema.foundesk.cl",
        SECRET_JWT: "opciones",
        LEGAL_STORAGE_PATH: "/var/www/foundesk/legal",
        UPLOADS_BASE_PATH: "/var/www/foundesk/uploads",
        CHROME_PATH: "/usr/bin/chromium-browser"
      }
    }
  ]
}
