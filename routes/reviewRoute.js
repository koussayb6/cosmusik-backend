const express = require('express')
const router = express.Router()
const {
    getReviews,
    setReview,
    updateReview,
    deleteReview
} = require('../controllers/reviewController')


router.route('/').get(getReviews).post(setReview)
router.route('/:id').put(updateReview).delete(deleteReview)


module.exports = router
