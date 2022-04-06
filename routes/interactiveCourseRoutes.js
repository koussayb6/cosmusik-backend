const router= require('express').Router();
const interactiveCourseController =require('../controllers/interactiveCourseController')

router.get('/',interactiveCourseController.readinteractiveCourse)
router.get('/filtre',interactiveCourseController.filtreit)
router.post('/',interactiveCourseController.createinteractiveCourse)
router.put('/:id',interactiveCourseController.updateinteractiveCourse)
router.delete('/:id',interactiveCourseController.deleteinteractiveCourse)
//Weeks
router.patch('/add-week/:id',interactiveCourseController.addweek)
router.patch('/edit-week/:id',interactiveCourseController.editweek)
router.patch('/delete-week/:id',interactiveCourseController.editweek)
module.exports= router

module.exports= router