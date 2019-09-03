const path = require("path");
const express = require("express");

const port = 5000;
const appState = { appName: "ihome" };
let devices = [];

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static(path.resolve("client")));

app.get("/", function(req, res) {
  res.sendFile(path.resolve("client/index.html"));
});

const server = require("net").createServer(function(c) {
  // A new client as connected
  devices.push(c);
  //TODO: create device data handler
  c.on("data", function(data) {
    data = JSON.parse(data);
    appState[data.id] = data;
    console.log(appState);
    io.emit("data", appState);
  });

  c.on("end", function() {
    console.log("connection end");
    devices = devices.filter(s => s !== c);
    c.end();
  });
});
server.listen(1234);

io.on("connection", function(socket) {
  console.log("a user connected");
  io.emit("data", appState);
  // TODO: create client data handler
  socket.on("message", function(msg) {
    console.log(msg);
    console.log(devices.length);
    devices.forEach(s => s.write(msg));
  });
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
});

app.use((err, request, response, next) => {
  if (err) {
    response.status(500).send("Server error!");
  }
});

http.listen(port, err => {
  if (err) {
    return console.log("something bad happened", err);
  }
  console.log(`server is listening on port ${port}`);
});
