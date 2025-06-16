const Category = require('../models/categoryModel')
const errorHandler = require('../utils/error')

const createCategory = async (req, res, next) => {
    try {
        if(!req.user.isAdmin){
            return next(errorHandler(403, "Not allowed to create category"))
        }

        const { categoryName, description, banner } = req.body

        if(!categoryName) {
            return next(errorHandler(400, 'Category name is required'))
        }

        const newCategory = new Category({
            userId: req.user.id,
            categoryName,
            description,
            banner
        })

        const savedCategory = await newCategory.save()

        res.status(200).json(savedCategory)
    } catch (error) {
        next(error)
    }
}

const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find()

        if(categories.length === 0){
            return next(errorHandler(404, 'No categories found'))
        }

        res.status(200).json(categories)
    } catch (error) {
        next(error)
    }
}

const deleteCategory = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'You are not allowed to delete this post'));
    }

    try {
        await Category.findByIdAndDelete(req.params.categoryId)
        res.status(200).json('The category has been deleted')
    } catch (error) {
        next(error)
    }
}

const updateCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.categoryId)

        if(!category){
            return next(errorHandler(404, 'Category not found'))
        }

        if(category.userId !== req.user.id){
            return next(errorHandler(403, 'Not allowed to update this category'))
        }

        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.categoryId,
            {
                $set: {
                    categoryName: req.body.categoryName,
                    description: req.body.description,
                    banner: req.body.banner
                }
            },
            { new: true }
        )

        res.status(200).json(updatedCategory)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createCategory,
    getCategories,
    deleteCategory,
    updateCategory
}