require('dotenv').config({path:'secrets.env'});

const express = require('express');
const mqtt = require('mqtt');
const http = require('http');
const socketIo = require('socket.io');
const basicAuth = require('basic-auth');
const path = require('path'); // Adicionado para servir arquivos estáticos

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const cors = require('cors');
app.use(cors());


let sensorData = {
    temperatura: null,
    humidade: null,
    ldr: null,
    led: null,
    hora: null
};

// Função de verificação das credenciais
function checkAuth(req, res, next) {
    const user = basicAuth(req);
    const validUsername = process.env.BASIC_AUTH_USERNAME;
    const validPassword = process.env.BASIC_AUTH_PASSWORD;

    if (!user || user.name !== validUsername || user.pass !== validPassword) {
        res.set('WWW-Authenticate', 'Basic realm="example"');
        return res.status(401).send('Autenticação necessária.');
    }
    next();
}

// Middleware de autenticação para todas as rotas
app.use(checkAuth);

// Configuração do broker MQTT
const mqttBrokerUrl = 'mqtt://mqtt:1883'; // Localhost
const mqttOptions = {
    clientId: "Teste",
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
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

// Servir os arquivos estáticos do frontend React
app.use(express.static(path.join(__dirname, 'notiipt', 'dist')));

// Rota de teste
app.get('/test', (req, res) => {
    res.send('API a funcionar..');
});

// Rota que retorna os dados do MQTT
app.get('/api/dados', (req, res) => {
    res.json(sensorData);
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'notiipt', 'dist', 'index.html'));
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
