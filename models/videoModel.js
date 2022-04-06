const mongoose = require('mongoose')
const {Schema} = mongoose

const videoSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    length: {
        type: Number,
        //required: true
    },
    likes: {
        type: Number,
    },
},{timestamps: true})

module.exports = mongoose.model('video', videoSchema);
