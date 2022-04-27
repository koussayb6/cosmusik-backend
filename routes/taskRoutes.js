const router= require('express').Router();
const taskController =require('../controllers/taskController')

router.get('/',taskController.readTask)
router.post('/:courseid',taskController.createTask)
router.put('/:id',taskController.updateTask)
router.delete('/:id',taskController.deleteTask)

//Questions
router.patch('/add-question/:id',taskController.addQuestion)
router.patch('/edit-question/:id',taskController.editQuestion)
router.patch('/delete-question/:id',taskController.editQuestion)
module.exports= router