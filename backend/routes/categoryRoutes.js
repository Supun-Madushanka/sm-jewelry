const express = require('express')
const verifyToken = require('../utils/verifyUser')
const { createCategory, getCategories, deleteCategory } = require('../controllers/categoryController')

const router = express.Router()

router.post('/create', verifyToken, createCategory)
router.get('/getCategories', getCategories)
router.delete('/delete/:categoryId', verifyToken, deleteCategory)

module.exports = router