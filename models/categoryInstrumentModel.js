const mongoose = require('mongoose')

const categoryInstrumentSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
    }
)

module.exports = mongoose.model('categoryInstrument', categoryInstrumentSchema)
