const asyncHandler = require('express-async-handler')

const {json} = require("express");
const categoryInstrument = require("../models/categoryInstrumentModel");
const Instrument = require("../models/instrumentModel");
const Video = require("../models/videoModel");

const getinstrument = asyncHandler(async (req,res) => {
    const instrument = await Instrument.find()

    res.json(instrument)
})

const setinstrument = asyncHandler(async (req, res) => {
    const category = await categoryInstrument.findById(req.params.id);
    const instrument = await Instrument.create({
        label: req.body.label,
        description: req.body.description,
        category: category

    })
    res.json(instrument)
})

const updateinstrument = asyncHandler(async (req, res) => {
    const category = await categoryInstrument.findById(req.params.idcategory);

    const instrument = await Instrument.findByIdAndUpdate(req.params.idinstrument,
        {
            label: req.body.label,
            description: req.body.description,
            category: category
        })

    res.json(instrument)
})

const deleteinstrument = asyncHandler(async (req, res) => {
    const instrument = await Instrument.findById(req.params.id)

    if (!instrument) {
        res.status(400)
        throw new Error('instrument not found')
    }



    await instrument.remove()

    res.status(200).json({ id: req.params.id })
});
const filtreInstrument = asyncHandler(async (req,res)=>{
    const keyword = req.query.search
        ? {
            $and:[{ label: { $regex: req.query.search, $options: "i" } }],
            //$and: [{ likes: { $gte: req.query.likes } }],
        }
        : {};

    const instrument = await Instrument.find(keyword);
    res.send(instrument);

});

module.exports = {
    getinstrument,
    setinstrument,
    updateinstrument,
    deleteinstrument,
    filtreInstrument
}
