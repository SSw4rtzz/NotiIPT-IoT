const express = require('express');
const mqtt = require('mqtt');
const http = require('http');
const socketIo = require('socket.io');
const oauthServer = require('express-oauth-server');

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

app.oauth = new oauthServer({
    model: {}, // Especificar seu modelo de dados de autenticação OAuth 2.0 aqui
    allowBearerTokensInQueryString: true
});

// Endpoint para autenticação de token
app.all('/oauth/token', app.oauth.token());

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

// Middleware de autenticação para verificar o token OAuth 2.0
function authenticateRequest(req, res, next) {
    const token = req.headers.authorization ? req.headers.authorization.replace('Bearer ', '') : null;
    // Validar o token usando o seu modelo de dados de autenticação OAuth 2.0
    // Se o token for válido, chame next()
    // Senão, retorne um erro de autenticação
    if (token) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
}
