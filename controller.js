const initialState = {
  appName: "ihome",
  esp: { connected: false, state: {} }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "esp/connected":
      return {
        ...state,
        esp: { ...state.esp, connected: true, state: action.payload }
      };
    case "esp/disconnected":
      return {
        ...state,
        esp: { ...state.esp, connected: false }
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
    client.subscribe("esp/disconnected");
    client.subscribe("esp/state");
  });

  // TODO: handle esp disconnect
  client.on("message", (topic, message) => {
    store.dispatch({ type: topic, payload: JSON.parse(message.toString()) });
  });

  io.on("connection", function(socket) {
    console.log("a user connected");
    store.subscribe(() => io.emit("state", store.getState()));
    store.dispatch({});

    const isEspConnected = () => store.getState().esp.connected;
    socket.on("esp/led1on", msg =>
      isEspConnected()
        ? client.publish("esp/led1on")
        : console.log("esp disconnected")
    );
    socket.on("esp/led1off", msg =>
      isEspConnected()
        ? client.publish("esp/led1off")
        : console.log("esp disconnected")
    );
  });
};
