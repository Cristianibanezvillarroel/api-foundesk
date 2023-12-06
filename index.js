const express = require('express'),
    mongoose = require('mongoose'),
    routes = require('./src/routes/index')
const app = express();
const bodyParser = require('body-parser')
//const { readFile } = require('./fileSystem')
//const { readData, readDataCategories, readDataBlogs, readDataCustomerTestimonials, readDataTemplates } = require('./functions')
require('dotenv').config()
const port = process.env.PORT;
const cors = require('cors')

const corsOptions = {
    origin: 'https://cristianibanezvillarroel.github.io',
    //origin: '*',
    credentials: true,
    methods: 'GET,PUT,POST,DELETE',
    optionsSuccessStatus: 204
}

app.use(function (req, res, next) {
    res.header("'Access-Control-Allow-Origin' : 'https://cristianibanezvillarroel.github.io'");
    //res.header("'Access-Control-Allow-Origin' : '*'");
    res.header("'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'");
    next();
})

app.use(cors(corsOptions))

app.use(bodyParser.json())

app.use('/v1', routes)

mongoose.connect(process.env.MONGO_URI)


app.listen(port, () => {
    console.log(`la api de foundesk esta escuchando en el puerto: ${port} y la uri de la base de datos es: ${process.env.MONGO_URI}`)
})