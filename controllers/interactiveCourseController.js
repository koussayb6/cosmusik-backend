const asyncHandler = require('express-async-handler')
const interactiveCourse = require('../models/interactiveCourseModel')
const Instrument = require('../models/instrumentModel')
const objectId= require('mongoose').Types.ObjectId
const {json} = require("express");

const getInteractiveCourse = asyncHandler(async (req,res) => {
    const vc = await interactiveCourse.find().populate('user')

    res.json(vc)
})
const getOneInteractiveCourse = asyncHandler(async (req,res) => {
    const vc = await interactiveCourse.findById(req.params.iduser)

    res.json(vc)
})

const setInteractiveCourse = asyncHandler(async (req, res) => {
    const instrument = await Instrument.findById(req.body.instrument) 
    const vc = await interactiveCourse.create({
        user :  req.user.id ,
        title: req.body.title,
        state: req.body.state,
        description: req.body.description,
        price: req.body.price,
        language: req.body.language,
        weeks:req.body.weeks,
        tasks:req.body.tasks,
        instrument:instrument,
        tasks:req.body.tasks


    })

    res.json(req.body)
})

const addweek= asyncHandler(async (req, res) => {

    const vc = await interactiveCourse.findByIdAndUpdate(req.params.id,
        {
            $push: {
                weeks: {
                    title: req.body.title,
                    description: req.body.description,
                    lessons: req.body.lessons
                },
            },
        },
    );
    res.json(vc)
})


const updateweek = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        return interactiveCourse.findById(req.params.id, (err, docs) => {
            const theweek = docs.weeks.find((week) =>
                week._id.equals(req.body.id)
            );

            if (!theweek) return res.status(404).send("Comment not found");
            theweek.title = req.body.title;
            theweek.description = req.body.description;
            theweek.lessons = req.body.lessons;

            return docs.save((err) => {
                if (!err) return res.status(200).send(docs);
                return res.status(500).send(err);
            });
        });
    } catch (err) {
        return res.status(400).send(err);
    }

    
};
const addlesson = asyncHandler(async (req, res) => {

    const vc = await lessoncourse.findByIdAndUpdate({_id:req.params.idlessoncourse ,"sections._id":req.params.idsection},
        {
            $push: {
                "sections.0.lessons": {
                    title: req.body.title,
                    description: req.body.description,
                    subtitles: req.body.subtitles,
                    lengh: req.body.lengh,
                    path: req.body.path
                },
            },
        },
    );
    res.send("done")
})
module.exports = {
    getInteractiveCourse,
    setInteractiveCourse,
    addweek,
    updateweek,
    getOneInteractiveCourse,
    addlesson,

}

