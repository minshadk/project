// Import required modules
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const mongoose = require("mongoose");
const app = require("./app");
const { Server } = require("socket.io");
const User = require("./models/userModel");


let server;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log(
      "Connected to the database and running on port",
      process.env.PORT
    );
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

server = app.listen(process.env.PORT, () => {
  console.log(
    "Connected to the database and running on port",
    process.env.PORT
  );
});

// Initialize Socket.io server and configure it
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

let onlineUsers = [];

io.on("connection", (socket) => {
  socket.on("set user online", async (userId) => {
    try {
      onlineUsers.push({ userId: userId, socketId: socket.id });
      updateUsers(userId, true);
    } catch (err) {}

    socket.join(userId);
  });

  socket.on("join project", (projectId) => {
    socket.join(projectId);
  });

  socket.on("new comment", (newCommented) => {
    socket.in(newCommented.projectId).emit("receive message", newCommented);
  });

  // Handle "delete project" event
  socket.on("delete project", (deleted) => {
    console.log("project is running 0 00 0 0 0 0 0");
    console.log(deleted);
    console.log(deleted);
    try {
      deleted.users.forEach((user) => {
        console.log(user._id);
        io.to(user._id).emit("remove deleted project", deleted.projectId);
      });
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  });

  socket.on("disconnect", async () => {
    const disconnectedUser = onlineUsers.find(
      (user) => user.socketId === socket.id
    );
    if (disconnectedUser) {
      const disconnectedUserId = disconnectedUser.userId;
      updateUsers(disconnectedUserId, false);
    }
  });
});
async function updateUsers(userId, userStatus) {
  const user = await User.findByIdAndUpdate(userId, { online: userStatus });
  const users = await User.find();
  io.emit("users", users);
}
