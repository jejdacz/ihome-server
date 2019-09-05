const socketIo = require("socket.io");

module.exports = http => {
  const io = socketIo(http);

  io.on("connection", function(socket) {
    console.log("a user connected");
    io.emit("data", appState);
    socket.on("message", function(msg) {
      console.log("websocket:", msg);
    });
  });
  return io;
};
