
const req = require('express/lib/request')
const res = require('express/lib/response')
const taskModel = require('../models/taskModel')
const objectId= require('mongoose').Types.ObjectId

module.exports.readTask=(req,res)=>{
    taskModel.find((err,docs )=> {
        if(!err) res.send(docs)
        else console.log("error to get data :"+err)
    })
}
module.exports.createTask= async (req,res)=>{
    const newTask = new taskModel({
       taskId:req.body.taskId, 
       title:req.body.title,
       description:req.body.description,
       limitDate:req.body.limitDate,
       image:req.body.image,
       questions:req.body.questions
       

       
    })
    try{
        const task= await newTask.save()
        return res.status(201).json(task)
    } catch(err){
        return res.status(400).send(err)
    }
}


module.exports.updateTask=(req,res)=>{
    if(!objectId.isValid(req.params.id))
    return res.status(400).send('ID unknown : '+ req.params.id)

const updatedRecord={
       title:req.body.title,
       description:req.body.description,
       limitDate:req.body.limitDate,
       image:req.body.image,
       questions:req.body.questions

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