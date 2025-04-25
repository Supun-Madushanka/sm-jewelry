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

const deleteUser = async (req, res, next) => {
    if(!req.user.isAdmin && req.user.id !== req.params.userId){
        return next(errorHandler(403, 'You are not allowed to delete this user'))
    }

    try {
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json('User has been deleted')
    } catch (error) {
        next(error)
    }
}

const getAllUsers = async (req, res, next) => {
    if(!req.user.isAdmin){
        return next(errorHandler(403, 'You are not allowed to get all users'))
    }

    try {
        const users = await User.find({}, '-password')
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId)

        if(!user){
            return next(errorHandler(404, 'User not found'))
        }

        if(req.user.id !== req.params.userId){
            return next(errorHandler(403, 'Not allowed to view this user'))
        }

        const { password, ...rest } = user._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

const signout = async (req, res, next) => {
    try {
        res.clearCookie('access_token').status(200).json('User has been signed out')
    } catch (error) {
        next(error)
    }
}

module.exports = {
    updateUser,
    deleteUser,
    getAllUsers,
    getUser,
    signout
}