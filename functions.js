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

const readDataBlogs = () => {
    try {
        const dataBlogs = fs2.readFileSync('./dbBlogs.json')
        return JSON.parse(dataBlogs)
    } catch (error) {
        console.log(error)
    }
}

const readDataCustomerTestimonials = () => {
    try {
        const dataCustomerTestimonials = fs2.readFileSync('./dbCustomerTestimonials.json')
        return JSON.parse(dataCustomerTestimonials)
    } catch (error) {
        console.log(error)
    }
}

const readDataTemplates = () => {
    try {
        const dataTemplates = fs2.readFileSync('./dbTemplates.json')
        return JSON.parse(dataTemplates)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { readData, readDataCategories, readDataBlogs, readDataCustomerTestimonials, readDataTemplates }