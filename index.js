const path = require("path");
const express = require("express");
const port = 5000;

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

require("./controller")(io);

app.use(express.static(path.resolve("client")));
/*
app.get("/", function(req, res) {
  res.sendFile(path.resolve("client/index.html"));
});*/

app.use((err, request, response, next) => {
  if (err) {
    response.status(500).send("Server error!");
  }
});

http.listen(port, err => {
  if (err) {
    return console.log("Server connection error!", err);
  }
  console.log(`server is listening on port ${port}`);
});
