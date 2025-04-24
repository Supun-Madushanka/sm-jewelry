const errorHandler = require("../utils/error")
const bcryptjs = require('bcryptjs')
const User = require('../models/userModel')

const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.userId){
        return next(errorHandler(403, 'You are not allowed to update this user'))
    }

    if(req.body.password){
        req.body.password = bcryptjs.hashSync(req.body.password, 10)
    }

        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.userId, {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                }
            }, { new: true })
            const { password, ...rest } = updatedUser._doc;
            res.status(200).json(rest)
        } catch (error) {
            next(error)
        }
}

module.exports = {
    updateUser
}