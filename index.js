const express = require('express'),
    mongoose = require('mongoose'),
    routes = require('./src/routes/index')
const app = express();
const bodyParser = require('body-parser')
const path = require('path')
require('dotenv').config()
//const port = process.env.PORT;
const cors = require('cors')

const corsOptions = {
    origin: '*',
    credentials: true,
    methods: 'GET,PUT,POST,DELETE,PATCH',
    optionsSuccessStatus: 204
}

app.use(cors(corsOptions))

app.use(bodyParser.json())

app.use('/v1/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/v1', routes)

// Conexión a MongoDB (usa variable de entorno o valor por defecto)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/foundesk'
mongoose.connect(MONGO_URI)
    .then(() => console.log('✓ Conectado a MongoDB'))
    .catch(err => console.error('✗ Error conectando a MongoDB:', err))

// Puerto (usa variable de entorno o 3000 por defecto)
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`✓ API de foundesk escuchando en puerto ${PORT}`)
})