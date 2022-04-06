const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            //required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            //required: [true, 'Please add an email'],
            unique: true,
        },
        password: {
            type: String,
           // required: [true, 'Please add a password'],
        },
        role: {
            type: String,
          //  required: [true, 'Please add a role'],
        },
        phone: {
            type: Number,
        },
        birthday: {
            type: Date,
        },
        status: {
            type: String,
            enum: ['Pending', 'Active'],
            default: 'Pending'
        },
        confirmationCode: {
            type: String,
            unique: true },
        facebookId: String,
        tempSecret: String
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('User', userSchema)
