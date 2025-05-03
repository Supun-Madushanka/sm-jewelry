const express = require('express')
const verifyToken = require('../utils/verifyUser')
const { createCategory, getCategories } = require('../controllers/categoryController')

const router = express.Router()

router.post('/create', verifyToken, createCategory)
router.get('/getCategories', getCategories)

module.exports = router