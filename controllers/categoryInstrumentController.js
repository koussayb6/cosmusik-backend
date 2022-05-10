const asyncHandler = require('express-async-handler')

const Review = require('../models/reviewModel')
const User = require('../models/userModel')
const {json} = require("express");
const videocourse = require("../models/videocourseModel");
const categoryInstrument = require("../models/categoryInstrumentModel")

const getcategory = asyncHandler(async (req,res) => {
    const category = await categoryInstrument.find()

    res.json(category)
})

const setcategory = asyncHandler(async (req, res) => {

    const category = await categoryInstrument.create({
        title: req.body.title,

    })
    res.json(category)
})

const updatecategory = asyncHandler(async (req, res) => {
    const category = await categoryInstrument.findByIdAndUpdate(req.params.id, req.body, {
        title: req.body.title
    })

    res.json(category)
})

const deletecategory = asyncHandler(async (req, res) => {
    const category = await categoryInstrument.findById(req.params.id)

    if (!category) {
        res.status(400)
        throw new Error('category not found')
    }



    await category.remove()

    res.status(200).json({ id: req.params.id })
})

module.exports = {
    getcategory,
    setcategory,
    updatecategory,
    deletecategory
}
