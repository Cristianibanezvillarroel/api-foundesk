const Blog = require('../models/Blog.model')

const getBlog = async (req, res) => {
    try {
        const resp = await Blog.find().populate('categorie');
        return res.json([{
            message: 'Blog',
            items: resp
        }])

    } catch (error) {
        return res.json({
            messaje: 'Error',
            detail: error.message
        })

    }
}

module.exports = {
    getBlog
}