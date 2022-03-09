const express = require('express')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const port = process.env.PORT || 5000

const taskRoutes= require('./routes/taskRoutes')
const interactiveCourseRoutes= require('./routes/interactiveCourseRoutes')

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))


//routes
app.use('/api/task',taskRoutes)
app.use('/api/interactiveCourse',interactiveCourseRoutes)

app.listen(port, () => console.log(`Server started on port ${port}`))
