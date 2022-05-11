const mongoose = require('mongoose')

const videoCourseSchema = new mongoose.Schema(
    {
        user:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },

        title:{
            type:String,
            //required: true
        },
        description:{
            type:String,
            //required: true
        },
        price:{
            type:Number,
            //required: true
        },
        state:{
            type:String,
            //required: true
        },
        rating:{
            type:Number,
            //required: true
        },
        language:{
            type:String,
            //required: true
        },
        views:{
            type:Number,
            //required: true
        },
        skillsAcquired:{
            type:String,
            //required: true
        },
        level:{
            type:String,
            //required: true
        },
        reviews:[{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],

        sections:{
            type:[
                {
                    title:String,
                    description:String,
                    videos:{
                        type:[
                            {
                                title:String,
                                description:String,
                                subtitles:String,
                                length:Number,
                                path:String,
                            }
                        ]
                    }
                }
            ]
        },


    },
    {
        timestamps:true
    }
)
module.exports = mongoose.model('VideoCourse',videoCourseSchema)
