const mongoose = require('mongoose')

const interactiveCourseSchema = new mongoose.Schema(
    {
    taskId:{
        type:String,
        unique: true
        
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
    startDate:{
        type:Date,
        //required: true
    },
    endDate:{
        type:Date,
        //required: true
    },

    },
    {
        timestamps:true
    }
)
module.exports = mongoose.model('interactiveCourse',interactiveCourseSchema)
