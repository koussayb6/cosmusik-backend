const asyncHandler = require('express-async-handler')
const ObjectID = require("mongoose").Types.ObjectId;
const Review = require('../models/reviewModel')

const User = require('../models/userModel')
const {json} = require("express");
const  Video  = require("../models/videoModel");
const  playlist  = require("../models/playlistModel");

const getAllPlaylist = asyncHandler(async (req, res) => {
    const allPlaylist = await playlist.find();
    res.json(allPlaylist);
});

const getPlaylist = asyncHandler(async (req, res) => {
    const playlist = await playlist.findById(req.params.id);
    res.json(playlist);

});


const addPlaylist = asyncHandler(async (req, res) => {
    if(!req.params.iduser){
    const thisPlaylist = await playlist.create({
        title: req.body.title,
        description: req.body.description,
    });
    res.json(thisPlaylist);}
    else {
        const user = await User.findById(req.params.iduser);
        const thisPlaylist = await playlist.create({
            title: req.body.title,
            description: req.body.description,
        });
        thisPlaylist.users.push(user);
        thisPlaylist.save();
        res.json(thisPlaylist);
    }
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {

        const video = await Video.findById(req.params.idvideo);
        const thisPlaylist = await playlist.findById(req.params.idplaylist);
        thisPlaylist.videos.push(video);
        thisPlaylist.save();
        res.json(thisPlaylist);
});

const deleteVideoFromPlaylist = asyncHandler(async (req, res) => {

    const video = await Video.findById(req.params.idvideo);
    const thisPlaylist = await playlist.findById(req.params.idplaylist);
    let index = thisPlaylist.videos.indexOf(video);
    thisPlaylist.videos.pop(index);
    thisPlaylist.save();
    res.json(thisPlaylist);
});

const updatePlaylist = asyncHandler(async (req, res) => {
    try {
        const thisPlaylist = await playlist.findByIdAndUpdate(
            req.params.id,
            { title: req.body.title, description: req.body.description }
        );
        res.json(thisPlaylist);
    } catch (error) {
        return res.status(400).json({ message: "Playlist not updated. Try again..." });
    }
});

const deletePlaylist = asyncHandler(async (req, res) => {
    try {
        const thisPlaylist = await playlist.findByIdAndDelete(req.params.id);
        return res.json(thisPlaylist);
    } catch (error) {
        return res.status(400).json({ message: "Playlist not deleted. Try again..." });
    }
});


module.exports={
   getAllPlaylist,
    getPlaylist,
    addPlaylist,
    updatePlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    deleteVideoFromPlaylist
};

