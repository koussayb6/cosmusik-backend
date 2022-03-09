const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema(
    {
        user: {
            type: Number,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        message: {
            type: String,
            required: true
        },

    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Review', reviewSchema)
