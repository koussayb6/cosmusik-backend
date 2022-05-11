const asyncHandler = require('express-async-handler')
const ObjectID = require("mongoose").Types.ObjectId;
const Review = require('../models/reviewModel')

const User = require('../models/userModel')
const {json} = require("express");
const  Video  = require("../models/videoModel");

const getAllVideo = asyncHandler(async (req, res) => {
        const allVideos = await Video.find();
        res.json(allVideos);
});

const getVideo = asyncHandler(async (req, res) => {
        const video = await Video.findById(req.params.id);
        res.json(video);

});

const getTrending = asyncHandler(async (req, res) => {
    try {
        const videos = await Video.find().sort({ likes: -1 }).limit(25);
        if (!videos) {
            return res.status(400).json({ message: "No videos found...." });
        } else {
            res.json(videos);
        }
    } catch (error) {
        return res.status(400).json({ message: "Videos not found. Try again..." });
    }
});

const addVideo = asyncHandler(async (req, res) => {
            const thisVideo = await Video.create({
                url: req.body.url,
                title: req.body.title,
                description: req.body.description,
                artist: req.body.artist,
                length: req.body.length,
                likes: 0
            });
            res.json(thisVideo);

});

const updateVideo = asyncHandler(async (req, res) => {
    try {
        const thisVideo = await Video.findByIdAndUpdate(
            req.params.id,
            { title: req.body.title, description: req.body.description }
        );
        res.json(thisVideo);
    } catch (error) {
        return res.status(400).json({ message: "Video not deleted. Try again..." });
    }
});

const likeVideo = asyncHandler(async (req, res) => {
    try {
        const thisVideo = await Video.findByIdAndUpdate(
            req.params.id,
            { $inc : {
                likes : 1
                } }
        );
        res.json(thisVideo);
    } catch (error) {
        return res.status(400).json({ message: "Video not liked. Try again..." });
    }
});
const deleteVideo = asyncHandler(async (req, res) => {
    try {
        const thisVideo = await Video.findByIdAndDelete(req.params.id);
        return res.json(thisVideo);
    } catch (error) {
        return res.status(400).json({ message: "Video not deleted. Try again..." });
    }
});

const filtreVideo = asyncHandler(async (req,res)=>{
       /* const keyword = req.query.search
            ? {
                 $and:[{ title: { $regex: req.query.search, $options: "i" } }],
                $and: [{ likes: { $gte: req.query.likes } }],
            }
            : {};

        const video = await Video.find(keyword);
        res.send(video);*/
    const {title, artist, likes}= req.query
    let condition={}

    if(title){
        condition.title={$regex:title}
    }
    if(artist) condition.artist={$regex:artist}
    if(likes) condition.likes={$gte:likes}
    const video= await Video.find(condition)
    res.json(video);

});

module.exports={
    getAllVideo,
    getVideo,
    getTrending,
    addVideo,
    updateVideo,
    deleteVideo,
    likeVideo,
    filtreVideo
};

