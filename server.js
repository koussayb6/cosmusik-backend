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
const cors = require("cors");
const io = require("socket.io")(8901, {
  cors: {
    origin: "http://localhost:3000",
  },
});
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//Routes
app.use("/api/post", postRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/users", userRoutes);
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
let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

io.on("connection", (socket) => {
  //when connect
  console.log("user is connected");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", ({ receiverId, content }) => {
    const a = users.find((x) => (x.userId = receiverId));
    io.to(a.socketId).emit("getMessage", {
      receiverId,
      content,
    });
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });

  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };

  const getUser = (userId) => {
    return users.find((user) => user === userId);
  };
});
app.listen(port, () => console.log(`Server started on port ${port}`));
