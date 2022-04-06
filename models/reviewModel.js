const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema(
    {
        user: {
            type: String,
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
        coursetype: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('Review', reviewSchema)
