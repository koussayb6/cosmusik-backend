const asyncHandler = require('express-async-handler')

const Review = require('../models/reviewModel')
const User = require('../models/userModel')
const {json} = require("express");
const interactiveCourse = require("../models/interactiveCourseModel");

const getsubscriptions = asyncHandler(async (req,res) => {
        const user = await User.findById(req.params.id)
        const sub = await user.subscriptions
        res.json(sub)
    })

const addsubscription = asyncHandler(async (req, res) => {

    const lesson = await interactiveCourse.findById(req.params.idlesson);
    let lessons=[];
    let totalhours=0;
    lesson.weeks.forEach(week =>
        week.lessons.forEach(lesson =>{
            lessons.push({lessonId: lesson._id ,duree: lesson.length , completed: false}),totalhours += lesson.length}));
    const sub = await User.findByIdAndUpdate(req.params.iduser,
        {
            $push: {
                subscriptions: {
                    lessonId: req.params.idlesson,
                    lessontype: req.body.lessontype,
                    progress: 0,
                    totalhours: totalhours,
                    lessons: lessons
                },
            },

        },
    );
    res.json(sub)
})

const validelesson = asyncHandler(async (req, res) => {
    const sub = await User.findById(req.params.iduser);
    let duree=0;
    let lessons=[];
    let subscription=[lessons];
    let lessonid=req.params.idlesson;
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
    sub.subscriptions.forEach(week =>{if(week.id===subid){
        week.lessons.forEach(lesson =>{if(lesson.lessonId===lessonid){
            duree=week.progress+(lesson.duree/week.totalhours)*100;
            lessons.push({lessonId: lesson.lessonId ,duree: lesson.duree , completed: true})}
        else {
                lessons.push({lessonId: lesson.lessonId ,duree: lesson.duree , completed: lesson.completed})
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
    //const lesson = await User.findById(req.params.idlesson);
    /*const vc = await User.findByIdAndUpdate({_id:req.params.iduser ,"subscriptions._id":req.params.idsubscription,
            "subscriptions.lessons._id":req.params.idlesson},
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
    validelesson
}
