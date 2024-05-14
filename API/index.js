const express = require('express');
const mqtt = require('mqtt');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let sensorData = {
    temperatura: null,
    humidade: null,
    ldr: null,
    led: null,
    hora: null
};

// Configuração do broker MQTT
const mqttBrokerUrl = 'mqtt://127.0.0.1:1883'; // Localhost
const mqttOptions = {
    clientId: "Teste",
    username: 'user1',
    password: 'user1'
};
const mqttClient = mqtt.connect(mqttBrokerUrl, mqttOptions);

// Subscreve o tópico 'sala0/#' ao conectar ao broker MQTT
mqttClient.on('connect', () => {
    console.log('Conectado ao broker MQTT');
    mqttClient.subscribe('sala0/#');
});

// Atualiza o objeto sensorData e envia a mensagem ao cliente via WebSocket quando uma mensagem é recebida do broker MQTT
mqttClient.on('message', (topic, message) => {
    console.log(`Nova mensagem recebida do tópico ${topic}: ${message.toString()}`);
    
    if (topic.startsWith('sala0/')) {
        const subtopic = topic.split('/')[1];
        sensorData[subtopic] = message.toString();
    }

    io.emit('dadosSensores', JSON.stringify(sensorData)); // Envia os dados agregados para o cliente via WebSocket
});

// Rota de teste
app.get('/', (req, res) => {
    res.send('API a funcionar..');
});

// Rota que retorna os dados do MQTT
app.get('/dados', (req, res) => {
    res.json(sensorData);
});

// Inicia o servidor HTTP
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Servidor HTTP iniciado na porta ${port}`);
});

// Configura o WebSocket
io.on('connection', (socket) => {
    console.log('Novo cliente WebSocket conectado');

    socket.on('disconnect', () => {
        console.log('Cliente WebSocket desconectado');
    });
});
