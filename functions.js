const fs2 = require('fs')

const readData = () => {
    try {
        const data = fs2.readFileSync('./dbCourses.json')
        return JSON.parse(data)
    } catch (error) {
        console.log(error)
    }
}

const readDataCategories = () => {
    try {
        const dataCategories = fs2.readFileSync('./dbCoursesCategories.json')
        return JSON.parse(dataCategories)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { readData, readDataCategories }