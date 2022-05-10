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
        twoFactor: Boolean,
        confirmationCode: {
            type: String,
            unique: true },
        facebookId: String,
        tempSecret: String,
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
        secretQR: String,
    },
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('User', userSchema)
