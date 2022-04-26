const asyncHandler = require('express-async-handler')

const Review = require('../models/reviewModel')
const User = require('../models/userModel')
const {json} = require("express");
const videocourse = require("../models/videocourseModel");

const getsubscriptions = asyncHandler(async (req,res) => {
        const user = await User.findById(req.params.id)
        const sub = await user.subscriptions
        res.json(sub)
    })

const addsubscription = asyncHandler(async (req, res) => {

    const course = await videocourse.findById(req.params.idcourse);
    let lessons=[];
    let totalhours=0;
    course.sections.forEach(section =>
        section.videos.forEach(video =>{
            lessons.push({lessonId: video._id ,duree: video.length , completed: false}),totalhours += video.length}));
    const sub = await User.findByIdAndUpdate(req.params.iduser,
        {
            $push: {
                subscriptions: {
                    courseId: req.params.idcourse,
                    coursetype: req.body.coursetype,
                    progress: 0,
                    totalhours: totalhours,
                    lessons: lessons
                },
            },

        },
    );
    res.json(sub)
})

const validevideo = asyncHandler(async (req, res) => {
    const sub = await User.findById(req.params.iduser);
    let duree=0;
    let lessons=[];
    let subscription=[lessons];
    let lessonid=req.params.idvideo;
    let subid=req.params.idsubscription;
    /*const valid = await User.findByIdAndUpdate({_id:req.params.iduser ,"subscriptions._id":req.params.idsubscription},
        [{
            $set : {
                "subscriptions.$.lessons.0.completed":
                    {
                        $cond: {
                            if: {
                                // check if user has required permission
                                "lessons._id":{$eq: req.params.idlesson}
                            },
                            then: true, // overwrite prop value
                            else: false, // return origin value
                        }
                    }
            }
        }])*/
    sub.subscriptions.forEach(section =>{if(section.id===subid){
        section.lessons.forEach(video =>{if(video.lessonId===lessonid){
            duree=section.progress+(video.duree/section.totalhours)*100;
            lessons.push({lessonId: video.lessonId ,duree: video.duree , completed: true})}
        else {
                lessons.push({lessonId: video.lessonId ,duree: video.duree , completed: video.completed})
            }}
        )}});
    const sub1 = await User.findOneAndUpdate({_id:req.params.iduser,"subscriptions._id":req.params.idsubscription},
        {
            $set: {
                "subscriptions.$.lessons":  lessons,
                "subscriptions.$.progress": duree
            },

        },
    );
    //const video = await User.findById(req.params.idvideo);
    /*const vc = await User.findByIdAndUpdate({_id:req.params.iduser ,"subscriptions._id":req.params.idsubscription,
            "subscriptions.lessons._id":req.params.idvideo},
        {
            $inc: {
                "subscriptions.0.progress": duree

            },
        },
    );*/
    res.json(lessons)
})

module.exports = {
    getsubscriptions,
    addsubscription,
    validevideo
}
