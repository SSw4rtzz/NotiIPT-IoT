const WebSocket = require('ws');
const { EventEmitter } = require('events');
const dbController = require('../controllers/dbController');
//const mqttController = require('../controllers/mqttController');

let wss;
const eventEmitter = new EventEmitter();

// Função para iniciar o servidor WebSocket
function startWebSocketServer(server) {
  wss = new WebSocket.Server({ server });

  // Lidar com eventos de conexão WebSocket
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    ws.location = ''; // Inicialmente definido como vazio

    // Lidar com a primeira mensagem recebida do cliente
    ws.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message);
        console.log('Received WebSocket message:', parsedMessage);
        
        if (parsedMessage.hasOwnProperty('Localizacao')) {
          ws.location = parsedMessage.Localizacao;
          console.log('Client location:', ws.location);

          // Send the last 10 records to the WebSocket client
          dbController.getLast10RecordsByLocation(ws.location)
            .then((lastRecords) => {
              // Send the latest 10 records to the client
              lastRecords.forEach((record) => {
                //console.log('Record before :', record);
                record.Tempo = record.Tempo.toISOString().replace('T', ' ').slice(0, -5);
                //console.log('Record after  :', record);
              });
              ws.send(JSON.stringify(lastRecords));
            })
            .catch((error) => {
              console.error('Error retrieving last 10 records:', error);
            });  
        } else if (parsedMessage.hasOwnProperty('list') && parsedMessage.list === 'all') {
          dbController.getLastRecordOfEachLocation()
            .then((lastRecords) => {
              ws.send(JSON.stringify(lastRecords));
            })
            .catch((error) => {
              console.error('Error retrieving last records of each location:', error);
            });
        } else if (parsedMessage.hasOwnProperty('Humidade') && parsedMessage.hasOwnProperty('Temperatura')) {
          // Message containing data sent by another WebSocket in the same location
          sendWebSocketData(parsedMessage);
        } else if (parsedMessage.hasOwnProperty('led')) {
                  
          // Importar o módulo mqttController aqui
          const mqttController = require('../controllers/mqttController');

          console.log('LED status message:', parsedMessage);
          // Message to control the LED status
          const command = parsedMessage.led === 'off' ? 'off' : 'on';
          mqttController.sendCommandMessage(command);
          console.log('LED command sent to MQTT:', command);
        } else {
          console.log('Invalid message format:', parsedMessage);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    // Lidar com o evento de fechamento do WebSocket
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });
}

// Função para enviar dados para os clientes WebSocket com a mesma localização
function sendWebSocketData(data) {
  console.log('Sending WebSocket data:', data);

  // Importar o módulo mqttController aqui
  const mqttController = require('../controllers/mqttController');

  if (wss && wss.clients.size > 0) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client.location === data.Localizacao) {
        const message = JSON.stringify([data]);
        client.send(message);
      }
    });
  }

}

module.exports = {
  startWebSocketServer,
  sendWebSocketData,
  eventEmitter,
};
