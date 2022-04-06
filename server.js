const express = require('express')
const dotenv = require('dotenv').config()
const connectDB = require('./config/db')
const port = process.env.PORT || 5000

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/pi/reviews', require('./routes/reviewRoute'))
app.use('/pi/videocourse', require('./routes/videocourseRoute'))
app.use('/pi/video', require('./routes/videoRoute'))
app.use('/pi/playlist', require('./routes/playlistRoute'))
app.use('/pi/instrument', require('./routes/instrumentRoute'))



// Serve frontend
/*if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  )
} else {
  app.get('/', (req, res) => res.send('Please set to production'))
}*/

app.listen(port, () => console.log(`Server started on port ${port}`))
