const express = require("express");
const app = express();
const socketio = require("socket.io");
const http = require("http");
const router = require("./router");
const PORT = process.env.PORT || 5000;

//creating a  http server;
const server = http.createServer(app);
//socket.io instance
const io = socketio(server);

//on new connection and disconnection
io.on("connection", (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    console.log(name, room);
  });

  socket.on("disconnect", () => {
    console.log("User had left");
  });
});

app.use(router);
server.listen(PORT, () => console.log(`Server is running at PORT ${PORT} `));
