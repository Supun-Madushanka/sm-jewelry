const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    categoryName: {
        type: String,
        required: true
    },

    description: {
        type: String
    }
}, {timestamps: true})

module.exports = mongoose.model('Category', categorySchema)