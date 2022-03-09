const req = require('express/lib/request')
const res = require('express/lib/response')
const interactiveCourseModel = require('../models/interactiveCourseModel')
const objectId= require('mongoose').Types.ObjectId

module.exports.readinteractiveCourse=(req,res)=>{
    interactiveCourseModel.find((err,docs )=> {
        if(!err) res.send(docs)
        else console.log("error to get data :"+err)
    })
}
module.exports.createinteractiveCourse= async (req,res)=>{
    const newinteractiveCourse = new interactiveCourseModel({
       title:req.body.title,
       description:req.body.description,


       

       
    })
    try{
        const interactiveCourse= await newinteractiveCourse.save()
        return res.status(201).json(interactiveCourse)
    } catch(err){
        return res.status(400).send(err)
    }
}


module.exports.updateinteractiveCourse=(req,res)=>{
    if(!objectId.isValid(req.params.id))
    return res.status(400).send('ID unknown : '+ req.params.id)

const updatedRecord={
       title:req.body.title,
       description:req.body.description,


}
 interactiveCourseModel.findByIdAndUpdate(
     req.params.id,
     {$set: updatedRecord},
     {new: true},
     (err,docs)=>{
         if(!err)res.send(docs)
         else  console.log("error to update data :"+err)
     }
 )
    
}


module.exports.deleteinteractiveCourse=(req,res)=>{
    if(!objectId.isValid(req.params.id))
    return res.status(400).send('ID unknown : '+ req.params.id)

    interactiveCourseModel.findByIdAndRemove(
        req.params.id,
        (err,docs)=>{
            if(!err)res.send(docs)
            else console.log("error to Delete data :"+err)
        }
    )
    
}