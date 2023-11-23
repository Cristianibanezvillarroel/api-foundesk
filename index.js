const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const { readFile } = require('./fileSystem')
const { readData } = require('./functions')
require('dotenv').config()
const port = process.env.PORT;
const cors = require('cors')

const corsOptions = {
    origin: 'https://cristianibanezvillarroel.github.io/',
    credentials: true,
    methods: 'GET,PUT,POST,DELETE',
    optionsSuccessStatus: 204
}

/*app.use(function(req, res, next) {
    res.header("'Access-Control-Allow-Origin' : 'https://cristianibanezvillarroel.github.io/'");
    res.header("'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'");
    next();
})*/

app.use(cors(corsOptions))

app.use(bodyParser.json())


app.get('/home/:id', (req, res) => {
    res.json({
        mensaje: req.params.id
    })
})

app.get('/db/:id', (req, res) => {
    const db = req.params.id
    if (db == 'courses') {
        const data = readData()
        res.json(data.Courses)
    }
})

app.post('/user', (req, res) => {
    const user = req.body
    const newuser = {id: 1, ...user }
    res.json({
        mensaje: 'usuario creado con exito',
        usuario: newuser
    })
})

app.listen(port, () => {
    console.log(`la api de foundesk esta escuchando en el puerto: ${port} `)
})