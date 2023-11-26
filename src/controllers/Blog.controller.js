const Blog = require('../models/Blog.model')

const getBlog = async (req, res) => {
    try {
        const resp = await Blog.find()
        return res.json([{
            message: 'Blog',
            items: resp
        }])

        const dataBlogs = readDataBlogs()
        res.json(dataBlogs.Blogs)
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