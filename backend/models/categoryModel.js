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
    },
    
    banner: {
        type: String,
        default: 'https://www.brilliance.com/cdn-cgi/image/f=webp,width=1440,height=1440,quality=90/sites/default/files/vue/collections/engagement-rings-diamond_og.jpg'
    }
}, {timestamps: true})

module.exports = mongoose.model('Category', categorySchema)