const fs = require('fs')

const readFile = () => {
    fs.readFile('nombrearchivo.txt', 'utf-8', (err, data) => {
        if (err) console.log(err)
        console.log('leido con exito', data)
    })
}

module.exports = { readFile }