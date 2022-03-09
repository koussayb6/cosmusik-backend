const router= require('express').Router();
const interactiveCourseController =require('../controllers/interactiveCourseController')

router.get('/',interactiveCourseController.readinteractiveCourse)
router.post('/',interactiveCourseController.createinteractiveCourse)
router.put('/:id',interactiveCourseController.updateinteractiveCourse)
router.delete('/:id',interactiveCourseController.deleteinteractiveCourse)


module.exports= router