const initialState = {
  appName: "ihome"
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "esp/connected":
      return {
        ...state,
        esp: { ...state.esp, connected: true, state: action.payload }
      };
    case "esp/state":
      return {
        ...state,
        esp: { ...state.esp, state: action.payload }
      };
    default:
      return state;
  }
};

const store = require("./store")(reducer);

module.exports = io => {
  const mqtt = require("mqtt");
  const client = mqtt.connect("mqtt://localhost:1883");

  client.on("connect", () => {
    console.log("controller connected to broker");
    client.subscribe("esp/connected");
    client.subscribe("esp/state");
  });

  client.on("message", (topic, message) => {
    store.dispatch({ type: topic, payload: JSON.parse(message.toString()) });
  });

  io.on("connection", function(socket) {
    console.log("a user connected");
    store.subscribe(() => io.emit("state", store.getState()));
    store.dispatch({});

    socket.on("esp/led1on", msg => client.publish("esp/led1on"));
    socket.on("esp/led1off", msg => client.publish("esp/led1off"));
  });
};
