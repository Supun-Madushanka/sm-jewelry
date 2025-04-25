const express = require('express')
const { updateUser, deleteUser, getAllUsers, getUser, signout } = require('../controllers/userController')
const verifyToken = require('../utils/verifyUser')

const router = express.Router()

router.put('/update/:userId',verifyToken, updateUser)
router.delete('/delete/:userId', verifyToken, deleteUser)
router.get('/getUsers', verifyToken, getAllUsers)
router.get('/getUser/:userId', verifyToken, getUser)
router.post('/signout', signout)

module.exports = router