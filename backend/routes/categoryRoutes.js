const express = require('express')
const verifyToken = require('../utils/verifyUser')
const { createCategory } = require('../controllers/categoryController')

const router = express.Router()

router.post('/create', verifyToken, createCategory)

module.exports = router