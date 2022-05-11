const router= require('express').Router();
const interactiveCourseController =require('../controllers/interactiveCourseController');
const { protect } = require('../middleware/authMiddleware');
const {getInteractiveCourse,
    setInteractiveCourse,
    addweek,
    updateweek,
    addlesson,
    getOneInteractiveCourse

} = require('../controllers/interactiveCourseController')

const {getsubscriptions, addsubscription,validelesson} = require("../controllers/subscriptionController");

router.route('/').get(protect,getInteractiveCourse).post(protect,setInteractiveCourse)
router.route('/:id').post(protect,addweek).put(protect,updateweek).get(protect,getOneInteractiveCourse)
router.route('/addlesson/:idinteractivecourse/:idweek').post(protect,addlesson)
router.route('/validlesson/:iduser/:idsubscription/:idlesson').put(protect,validelesson)
router.route('/subscription/:id').get(protect,getsubscriptions)
router.route('/subscription/:iduser/:idcourse').post(protect,addsubscription)

//Weeks
router.route('/add-week/:id').post(protect,interactiveCourseController.addweek)
router.route('/delete-week/:id').put(protect,interactiveCourseController.updateweek)
module.exports= router

module.exports= router