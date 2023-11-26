const BlogCategories = require('../models/BlogCategories.model')

const getBlogCategories = async (req, res) => {
    try {
        const resp = await BlogCategories.find()
        return res.json({
            message: 'BlogCategories',
            items: resp
        })
    } catch (error) {
        return res.json({
            messaje: 'Error',
            detail: error.message
        })
        
    }
}

module.exports = {
    getBlogCategories
}