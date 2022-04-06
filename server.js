const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/db");
const bodyParser = require("body-parser");
const postRoutes = require("./routes/classPostRouter");
const groupRoutes = require("./routes/groupRouter");
const chatRoutes = require("./routes/chatRouter");
const userRoutes = require("./routes/userRoute");
const messageRoutes = require("./routes/messageRoutes");
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
app.use("/api/post", postRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);

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

app.listen(port, () => console.log(`Server started on port ${port}`));
