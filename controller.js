const initialState = {
  appName: "ihome",
  esp: { connected: false }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "esp/connected":
      return {
        ...state,
        esp: { ...state.esp, connected: true, ...action.payload }
      };
    case "esp/disconnected":
      return {
        ...state,
        esp: { ...state.esp, connected: false }
      };
    case "esp/state":
      return {
        ...state,
        esp: { ...state.esp, ...action.payload }
      };
    default:
      return state;
  }
};

const store = require("./store")(reducer);

const esp = {};
esp.isConnected = () => store.getState().esp.connected;

module.exports = io => {
  const mqtt = require("mqtt");
  const client = mqtt.connect("mqtt://localhost:1883");

  client.on("connect", () => {
    console.log("controller connected to broker");
    client.subscribe("esp/connected");
    client.subscribe("esp/disconnected");
    client.subscribe("esp/state");
  });

  client.on("message", (topic, message) => {
    let msg;
    try {
      msg = JSON.parse(message.toString());
    } catch (e) {
      console.error("message payload is not JSON");
      msg = {};
    }

    console.log(topic, msg);
    store.dispatch({ type: topic, payload: msg });
  });

  io.on("connection", function(socket) {
    console.log("a user connected");
    store.subscribe(() => io.emit("stateUpdated", store.getState()));
    store.dispatch({});

    socket.on(
      "esp/led1on",
      msg => esp.isConnected() && client.publish("esp/led1on")
    );
    socket.on(
      "esp/led1off",
      msg => esp.isConnected() && client.publish("esp/led1off")
    );
  });
};
