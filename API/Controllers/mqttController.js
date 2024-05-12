const events = require('events');
const mqtt = require('mqtt');
const config = require('../config/config');
const websocketController = require('../controllers/websocketController');
const dbController = require('../controllers/dbController');

const eventEmitter = new events.EventEmitter();
let client;

function connectToMQTT() {
  // Connect to MQTT server
  client = mqtt.connect({
    host: config.MQTT_SERVER,
    port: config.MQTT_PORT,
    username: config.MQTT_USERNAME,
    password: config.MQTT_PASSWORD,
  });

  // Handle MQTT connection events
  client.on('connect', () => {
    console.log('Connected to MQTT server');
    // Subscribe to MQTT topics
    client.subscribe(config.MQTT_TOPIC, (err) => {
      if (err) {
        console.error('Error subscribing to MQTT topic:', err);
      } else {
        console.log('Subscribed to MQTT topic:', config.MQTT_TOPIC);
      }
    });
  });

  // Insert data into the database
  const insertDataIntoDatabase = (data) => {
    console.log('Inserting data into the database on MQTT message event');
    dbController.insertData(data)
      .then(() => {
        console.log('Data inserted into the database');
      })
      .catch((error) => {
        console.error('Error inserting data into the database:', error);
      });
  };

  // Handle MQTT message events
  client.on('message', (topic, message) => {
    const mqttMessage = message.toString();
    const cleanedMessage = mqttMessage.replace(/[\r\n]/g, '');
    const data = JSON.parse(cleanedMessage);

    insertDataIntoDatabase(data);

    // Emit the event with the MQTT message only if the location matches
    eventEmitter.emit('mqttMessage', data);
    websocketController.sendWebSocketData(data);
  });

  // Handle MQTT error events
  client.on('error', (error) => {
    console.error('Error connecting to MQTT server:', error);
  });

  // Handle MQTT reconnect events
  client.on('reconnect', () => {
    // Reconnect event, resubscribe to MQTT topics
    console.log('Reconnecting to MQTT server');

    client.subscribe(config.MQTT_TOPIC, (err) => {
      if (err) {
        console.error('Error resubscribing to MQTT topic:', err);
      } else {
        console.log('Resubscribed to MQTT topic:', config.MQTT_TOPIC);
      }
    });
  });
}

// Function to send a command message on the "comandos" topic
function sendCommandMessage(command) {
  const topic = 'comandos';
  const message = command === 'on' ? 'on' : 'off';
  client.publish(topic, message, (err) => {
    if (err) {
      console.error('Error publishing command message:', err);
    } else {
      console.log(`Command message "${message}" published successfully`);
    }
  });
}

module.exports = {
  connectToMQTT,
  sendCommandMessage,
};
