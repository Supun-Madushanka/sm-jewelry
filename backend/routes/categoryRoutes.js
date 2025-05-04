const express = require('express')
const verifyToken = require('../utils/verifyUser')
const { createCategory, getCategories, deleteCategory, updateCategory } = require('../controllers/categoryController')

const router = express.Router()

router.post('/create', verifyToken, createCategory)
router.get('/getCategories', getCategories)
router.delete('/delete/:categoryId', verifyToken, deleteCategory)
router.put('/update/:categoryId', verifyToken, updateCategory)

module.exports = router