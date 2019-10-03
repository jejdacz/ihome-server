const mqtt = require("tinyMQTT-mod").create("10.0.0.200",{
    client_id : "random",    
    keep_alive: 10,
  username:"john",
  password:"secret",
    will_topic: "esp/disconnected",
    will_payload: JSON.stringify({msg:"exit"})
});

let state = {
  led1 : 0
};

//E.on("init", () => {
  digitalWrite(16,1);
//});

const handleLed1on = () => {
  if (!state.led1) {
    state.led1 = 1;
    digitalWrite(16,0);    
    mqtt.publish("esp/state",JSON.stringify(state));
  }
};

const handleLed1off = () => {
  if (state.led1) {
    state.led1 = 0;    
    mqtt.publish("esp/state",JSON.stringify(state));
    digitalWrite(16,1);
  }
};

const mqttConnect = () => {    
  
  mqtt.on("connected", function(){
    console.log("connected");

    mqtt.subscribe("esp/led1on");
    mqtt.subscribe("esp/led1off");


    mqtt.publish('esp/connected', JSON.stringify(state));

  });

  mqtt.on("message", function(msg){
      console.log(msg.topic);
      console.log(msg.message);
      switch (msg.topic) {
        case "esp/led1on": 
          handleLed1on();
          break;
        case "esp/led1off":
          handleLed1off();
          break;
        default: console.log("no handler for",msg.topic);
      }
  });

  mqtt.on("published", function(){
      console.log("message sent");
  });

  mqtt.on("disconnected", function(){
      console.log("disconnected");      
      mqtt.connect();
  });
  
  mqtt.connect();
};

const WIFI_NAME = "jejdaNET2";
const WIFI_OPTIONS = { password : "qT7xRvL6pU" };

const wifi = require("Wifi");

//E.on("init", () => {
  wifi.connect(WIFI_NAME, WIFI_OPTIONS, function(){
    console.log("wifi connected");  
    mqttConnect();
  });
//});



