const express = require('express')
const router = express.Router()
const {
    getReviews,
    setReview,
    updateReview,
    deleteReview,
    getCourseReviews
} = require('../controllers/reviewController')
const {protect} = require("../middleware/authMiddleware");


router.route('/').get(getReviews)
router.route('/:id').put(updateReview).delete(deleteReview).get(getCourseReviews)
router.route('/:idcourse').post(protect, setReview)


module.exports = router
