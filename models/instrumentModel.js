const mongoose = require('mongoose')

const instrumentSchema = mongoose.Schema(
    {
        label: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        category: { type: mongoose.Schema.Types.ObjectId, ref: "video" }
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('instrument', instrumentSchema)
