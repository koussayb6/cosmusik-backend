const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema(

{
    taskId:{
        type:String,
        
    },
    title:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    limitDate:{
        type:Date,
        required: true
    },
    image:{
        type:String,
        required: true
    },
    questions:{
        type:[
            {
            questionId:String,
            question:String,
            answers:[String],
            correctAnswer:String
            }

        ]
    },
    iCourse:{
        type:String
    },
    
},
{
    timestamps:true
}
);
module.exports = mongoose.model('post',PostSchema)