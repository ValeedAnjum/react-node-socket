const express = require("express");
const app = express();
const socketio = require("socket.io");
const http = require("http");
const router = require("./router");
const PORT = process.env.PORT || 5000;
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");
//creating a  http server;
const server = http.createServer(app);
//socket.io instance
const io = socketio(server);

//on new connection and disconnection
io.on("connection", (socket) => {
  //fires when a new user join
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    if (error) return callback(error);

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to the room ${user.room}`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name}, has joined` });
    socket.join(user.room);

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message });

    callback();
  });

  //fires when a user leave
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left.`,
      });
    }
  });
});

app.use(router);
server.listen(PORT, () => console.log(`Server is running at PORT ${PORT} `));
