const express = require('express')
const router = express.Router()
const {getVideoCourse,
    setVideoCourse,
    addsection,
    updatesection,
    addvideo,
    getOneVideoCourse

} = require('../controllers/videocourseController')
const {getsubscriptions, addsubscription,validevideo} = require("../controllers/subscriptionController");


router.route('/').get(getVideoCourse)
router.route('/video/:iduser').post(setVideoCourse).get(getOneVideoCourse)
router.route('/:id').post(addsection).put(updatesection)
router.route('/addvideo/:idvideocourse/:idsection').post(addvideo)
router.route('/validvideo/:iduser/:idsubscription/:idvideo').put(validevideo)
router.route('/subscription/:id').get(getsubscriptions)
router.route('/subscription/:iduser/:idcourse').post(addsubscription)




module.exports = router
