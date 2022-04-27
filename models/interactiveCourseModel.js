const mongoose = require('mongoose')

const interactiveCourseSchema = new mongoose.Schema(
    {

        title: {
            type: String,
            //required: true
        },
        description: {
            type: String,
            //required: true
        },
        price: {
            type: String,
            //required: true
        },
        state: {
            type: String,
            //required: true
        },
        rating: {
            type: String,
            //required: true
        },
        language: {
            type: String,
            //required: true
        },
        views: {
            type: Number,
            //required: true
        },
        skillsAcquired: {
            type: String,
            //required: true
        },
        level: {
            type: String,
            //required: true
        },
        startDate: {
            type: Date,
            //required: true
        },
        endDate: {
            type: Date,
            //required: true
        },
        
        
        weeks: {
            type:
                [
                    {
                        title:String,
                        description:String,
                        lessons:
                        {
                            type:
                                [
                                    {
                                        title:String,
                                        description:String,
                                        length:Number,
                                    }
                                ]
                        }
                    }

                ]
        },
        reviews:[{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
        instrument:{ type: mongoose.Schema.Types.ObjectId, ref: "Instrument" },
        user:{ type: mongoose.Schema.Types.ObjectId, ref: "User" }
    },
    

    {
        timestamps: true
    }
)
module.exports = mongoose.model('InteractiveCourse', interactiveCourseSchema)
