const asyncHandler = require('express-async-handler')

const Review = require('../models/reviewModel')
const User = require('../models/userModel')
const {json} = require("express");
const videocourse = require("../models/videocourseModel");

const getReviews = asyncHandler(async (req,res) => {
    const reviews = await Review.find()

    res.json(reviews)
})

const setReview = asyncHandler(async (req, res) => {
    if (!req.body.message) {
        res.status(400)
        throw new Error('Please add a text field')
    }

    const review = await Review.create({
        message: req.body.message,
        user: req.body.user,
        rating: req.body.rating
    })



    const vc = await videocourse.findByIdAndUpdate(req.params.id,
        {
            $push: {
                reviews:
                    review.id

            },
        },
    );
    res.json(review)
})

const updateReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id)

    if (!review) {
        res.status(400)
        throw new Error('review not found')
    }

    const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.json(updatedReview)
})

const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id)

    if (!review) {
        res.status(400)
        throw new Error('review not found')
    }



    await review.remove()

    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getReviews,
    setReview,
    updateReview,
    deleteReview
}