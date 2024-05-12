const express = require('express');
const mqtt = require('mqtt');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let mqttData = '';

// Configuração do  broker MQTT
const mqttBrokerUrl = 'mqtt://7.tcp.eu.ngrok.io:15840'; //! Alterar Link
const mqttOptions = {
    clientId: "Teste",
    username: 'user1',
    password: 'user1'
};
const mqttClient = mqtt.connect(mqttBrokerUrl, mqttOptions);

// Subscreve o tópico 'dadosSensores' ao conectar ao broker MQTT
mqttClient.on('connect', () => {
    console.log('Conectado ao broker MQTT');
    mqttClient.subscribe('dadosSensores'); 
});

// Guarda e envia a mensagem ao cliente via WebSocket quando uma mensagem é recebida do broker MQTT
mqttClient.on('message', (topic, message) => {
    console.log('Nova mensagem recebida do broker MQTT:', message.toString());
    mqttData = message.toString();
    io.emit('dadosSensores', message.toString()); // Envia a mensagem para o cliente via WebSocket
});


// Rota de teste
app.get('/', (req, res) => {
    res.send('API a funcionar..');
});

// Rota que retorna os dados do MQTT
app.get('/dados', (req, res) => {
    res.send(mqttData);
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