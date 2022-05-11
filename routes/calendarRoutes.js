const router= require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const {readTask,createTask} = require('../controllers/taskController');
const taskModel = require('../models/taskModel');

router.route('/').get(readTask)

router.post("/",async (req,res)=>{
    try{
    const task=await taskModel.create(req.body);
    res.status(201).send("Task Added");

}catch(e){
    res.send(e);
}
    await taskModel.save();
    
   
})
module.exports= router