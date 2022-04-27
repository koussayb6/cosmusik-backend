const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema(

{
    
    title:{
        type:String,
        required: true
    },
    description:{
        type:String,
      
    },
    start:Date,
    limitDate:{
        type:Date,
        
    },
    image:{
        type:String,
        
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
    course:  { type: mongoose.Schema.Types.ObjectId, ref: "InteractiveCourse" }
    
},
{
    timestamps:true
}
);
module.exports = mongoose.model('Task',PostSchema)