const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
        },
        role: {
            type: String,
            required: [true, 'Please add a role'],
        },
        phone: {
            type: Number,
        },
        birthday: {
            type: Date,
        },
        state: {
            type: String,
        },
        subscriptions:{
            type:[
                {
                    courseId:String,
                    coursetype:String,
                    progress : Number,
                    totalhours:Number,
                    lessons:{
                        type:[
                            {
                                lessonId:String,
                                duree:Number,
                                completed:Boolean
                            }
                        ]
                    }
                }
            ],

        },
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('user', userSchema)
