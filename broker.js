var aedes = require("aedes")();
var server = require("net").createServer(aedes.handle);
var port = 1883;

server.listen(port, function() {
  console.log("server listening on port", port);
});

// allow websocket client for testing
var httpServer = require("http").createServer();
var ws = require("websocket-stream");
var wsPort = 8888;

ws.createServer(
  {
    server: httpServer
  },
  aedes.handle
);

httpServer.listen(wsPort, function() {
  console.log("websocket server listening on port", wsPort);
});

aedes.on("publish", function(packet, client) {
  //console.log(packet);
  if (client) {
    console.log(
      "********************",
      "\n* message from:",
      client.id,
      "\n* message topic:",
      packet.topic,
      "\n* message text:",
      packet.payload.toString(),
      "\n* message length:",
      packet.topic.length + Buffer.byteLength(packet.payload)
    );
  }
});

aedes.on("keepaliveTimeout", function() {
  console.log("keep alive timeout");
});

aedes.on("client", function(client) {
  //console.log("new client", client);
});
