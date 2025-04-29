const Category = require('../models/categoryModel')
const errorHandler = require('../utils/error')

const createCategory = async (req, res, next) => {
    try {
        if(!req.user.isAdmin){
            return next(errorHandler(403, "Not allowed to create category"))
        }

        const { categoryName, description } = req.body

        if(!categoryName) {
            return next(errorHandler(400, 'Category name is required'))
        }

        const newCategory = new Category({
            userId: req.user.id,
            categoryName,
            description
        })

        const savedCategory = await newCategory.save()

        res.status(200).json(savedCategory)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createCategory
}