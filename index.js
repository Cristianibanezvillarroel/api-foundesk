const express = require('express'),
    mongoose = require('mongoose'),
    routes = require('./src/routes/index')
const app = express();
const bodyParser = require('body-parser')
const path = require('path')
require('dotenv').config()
const port = process.env.PORT;
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

mongoose.connect(process.env.MONGO_URI)


app.listen(port, () => {
    console.log(`la api de foundesk esta escuchando en el puerto: ${port} y la uri de la base de datos es: ${process.env.MONGO_URI}`)
})