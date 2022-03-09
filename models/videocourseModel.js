const mongoose = require('mongoose')

const videoCourseSchema = new mongoose.Schema(
    {
        user:{
            type:String,
            required:true,
        },
        title:{
            type:String,
            //required: true
        },
        description:{
            type:String,
            //required: true
        },
        price:{
            type:String,
            //required: true
        },
        state:{
            type:String,
            //required: true
        },
        rating:{
            type:String,
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
        reviews:{
            type:[String

            ]
        },

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
                                lengh:String,
                                path:String,
                            }
                        ]
                    }
                }
            ]
        }

    },
    {
        timestamps:true
    }
)
module.exports = mongoose.model('VideoCourse',videoCourseSchema)