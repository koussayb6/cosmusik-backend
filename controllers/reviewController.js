const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')

const Review = require('../models/reviewModel')
const User = require('../models/userModel')
const {json} = require("express");
const interactivaCourse = require("../models/interactivaCourseModel");

const getReviews = asyncHandler(async (req,res) => {
    const reviews = await Review.find()

    res.json(reviews)
})
const getCourseReviews = asyncHandler(async (req,res) => {
    const reviews= await interactivaCourse.findById(req.params.id).populate('reviews');
        res.json(reviews.reviews)
    ;
    //const r =[];
    //await video.reviews.forEach(rev => r.push(Review.findById(rev)));

})
const setReview = asyncHandler(async (req, res) => {
    if (!req.body.message) {
        res.status(400)
        throw new Error('Please add a text field')
    }
    const user = await User.findById(req.params.iduser);
    const review = await Review.create({
        message: req.body.message,
        user: user,
        rating: req.body.rating
    })



    const vc = await interactivaCourse.findByIdAndUpdate(req.params.idcourse,
        {
            $push: {
                reviews: review

            },
        },
    );
    res.json(review)
});

const updateReview = asyncHandler(async (req, res) => {
    const updatedReview = await Review.findByIdAndUpdate(req.params.id, req.body, {
        $set : {
            message: req.body.message,
            rating: req.body.rating
        },
        new : true,
    })

    res.json(updatedReview)
});

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
    deleteReview,
    getCourseReviews
}
