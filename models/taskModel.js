const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema(

{
    taskId:{
        type:String,
        required: true
    }
}
)