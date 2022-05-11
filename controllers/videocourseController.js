const asyncHandler = require('express-async-handler')
const ObjectID = require("mongoose").Types.ObjectId;
const videocourse = require('../models/videocourseModel')
const Review = require('../models/reviewModel')

const User = require('../models/userModel')
const {json} = require("express");

const getVideoCourse = asyncHandler(async (req,res) => {
    const vc = await videocourse.find().populate('user')

    res.json(vc)
})
const getOneVideoCourse = asyncHandler(async (req,res) => {
    const vc = await videocourse.findById(req.params.iduser).populate('user').
    populate({path:'reviews', populate:{path: 'user'}})

    res.json(vc)
})

const setVideoCourse = asyncHandler(async (req, res) => {
    if (!req.body.title) {
        res.status(400)
        throw new Error('Please add a text field')
    }
    const user =await User.findById(req.params.iduser)
    const vc = await videocourse.create({
        user : user ,
        title: req.body.title,
        state: req.body.state,
        description: req.body.description,
        price: req.body.price,
        language: req.body.language,
        sections:req.body.sections


    })

    res.json(req.body)
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

const addvideo = asyncHandler(async (req, res) => {

    const vc = await videocourse.findByIdAndUpdate({_id:req.params.idvideocourse ,"sections._id":req.params.idsection},
        {
            $push: {
                "sections.0.videos": {
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
    getVideoCourse,
    setVideoCourse,
    addsection,
    updatesection,
    addvideo,
    getOneVideoCourse

}
