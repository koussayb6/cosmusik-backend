const asyncHandler = require('express-async-handler')
const ObjectID = require("mongoose").Types.ObjectId;
const videocourse = require('../models/videocourseModel')
const Review = require('../models/reviewModel')

const User = require('../models/userModel')
const {json} = require("express");

const getVideoCourse = asyncHandler(async (req,res) => {
    const vc = await videocourse.find()

    res.json(vc)
})

const setVideoCourse = asyncHandler(async (req, res) => {
    if (!req.body.user) {
        res.status(400)
        throw new Error('Please add a text field')
    }
    const vc = await videocourse.create({
        user : req.body.user,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        sections:req.body.sections


    })

    res.json(vc)
})

const addsection = asyncHandler(async (req, res) => {

    const vc = await videocourse.findByIdAndUpdate(req.params.id,
        {
            $push: {
                sections: {
                    title: req.body.title,
                    description: req.body.description,
                    videos: req.body.videos
                },
            },
        },
    );
    res.json(vc)
})


const updatesection = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send("ID unknown : " + req.params.id);

    try {
        return videocourse.findById(req.params.id, (err, docs) => {
            const thesection = docs.sections.find((section) =>
                section._id.equals(req.body.id)
            );

            if (!thesection) return res.status(404).send("Comment not found");
            thesection.title = req.body.title;
            thesection.description = req.body.description;
            thesection.videos = req.body.videos;

            return docs.save((err) => {
                if (!err) return res.status(200).send(docs);
                return res.status(500).send(err);
            });
        });
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports = {
    getVideoCourse,
    setVideoCourse,
    addsection,
    updatesection
}