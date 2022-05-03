const express = require('express')
const router = express.Router()
const {
    getReviews,
    setReview,
    updateReview,
    deleteReview,
    getCourseReviews
} = require('../controllers/reviewController')


router.route('/').get(getReviews)
router.route('/:id').put(updateReview).delete(deleteReview).get(getCourseReviews)
router.route('/:iduser/:idcourse').post(setReview)


module.exports = router
