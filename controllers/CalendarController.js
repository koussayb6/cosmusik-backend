var moment= require ('moment');
const taskModel = require('../models/taskModel')
const {json} = require("express");
const { createTask } = require('./taskController');
const expressAsyncHandler = require('express-async-handler');



const createEvent= expressAsyncHandler(async(req,res)=>{
    const newTask = await taskModel.create({
        title:req.body.title,
        description:req.body.description,
        limitDate:req.body.start,
        start:req.body.start,
        image:req.body.image,
        questions:[req.body.questions],
        course:course
    })
    res.json(req.body)
})

module.exports=createEvent;