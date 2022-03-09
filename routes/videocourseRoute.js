const express = require('express')
const router = express.Router()
const {getVideoCourse,
    setVideoCourse,
    addsection,
    updatesection

} = require('../controllers/videocourseController')
const {updateReview, deleteReview} = require("../controllers/reviewController");


router.route('/').get(getVideoCourse).post(setVideoCourse)
router.route('/:id').post(addsection).put(updatesection)




module.exports = router
