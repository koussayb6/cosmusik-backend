
const req = require('express/lib/request')
const res = require('express/lib/response')
const interactiveCourseModel = require('../models/interactiveCourseModel')
const taskModel = require('../models/taskModel')
const objectId= require('mongoose').Types.ObjectId

module.exports.readTask=(req,res)=>{
    taskModel.find((err,docs )=> {
        if(!err) res.send(docs)
        else console.log("error to get data :"+err)
    })
}
module.exports.createTask= async (req,res)=>{
    const  course=await interactiveCourseModel.findById(req.params.courseid)
    const newTask = new taskModel({
       title:req.body.title,
       description:req.body.description,
       limitDate:req.body.limitDate,
       image:req.body.image,
       questions:[req.body.questions],
       course:course
       

       
    })
    try{
        const task= await newTask.save()
        return res.status(201).json(task)
    } catch(err){
        return res.status(400).send("error while creating task"+err)
    }
}


module.exports.updateTask=async(req,res)=>{
    if(!objectId.isValid(req.params.id))
    return res.status(400).send('ID unknown : '+ req.params.id)
    const  course=await interactiveCourseModel.findById(req.params.courseid)
const updatedRecord={
       title:req.body.title,
       description:req.body.description,
       limitDate:req.body.limitDate,
       image:req.body.image,
       questions:req.body.questions,
       course:course

}
 taskModel.findByIdAndUpdate(
     req.params.id,
     {$set: updatedRecord},
     {new: true},
     (err,docs)=>{
         if(!err)res.send(docs)
         else  console.log("error to update data :"+err)
     }
 )
    
}


module.exports.deleteTask=(req,res)=>{
    if(!objectId.isValid(req.params.id))
    return res.status(400).send('ID unknown : '+ req.params.id)

    taskModel.findByIdAndRemove(
        req.params.id,
        (err,docs)=>{
            if(!err)res.send(docs)
            else console.log("error to Delete data :"+err)
        }
    )
    
}

module.exports.addQuestion=(req,res)=>{
    if(!objectId.isValid(req.params.id))
    return res.status(400).send('ID unknown : '+ req.params.id)
    try{
        return taskModel.findByIdAndUpdate(
            req.params.id,
            {
             $push:{
                 questions:{
                    
                    question:req.body.question,
                    answers:req.body.answers,
                    correctAnswer:req.body.correctAnswer

                 }
             }
            },
            {new: true},
            (err,docs)=>{
                if(!err) return res.send(docs)
                else  return res.status(400).send(err)
            }
        )
    }catch(err){
        res.status(400).send(err)
    }
} 

module.exports.editQuestion=(req,res)=>{
    
}

module.exports.deleteQuestion=(req,res)=>{
    
}