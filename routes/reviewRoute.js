const express = require('express')
const router = express.Router()
const {
    getReviews,
    setReview,
    updateReview,
    deleteReview
} = require('../controllers/reviewController')


router.route('/').get(getReviews)
router.route('/:id').post(setReview).put(updateReview).delete(deleteReview)


module.exports = router
