require('dotenv').config({ path: 'secrets.env' });

const express = require('express');
const mqtt = require('mqtt');
const axios = require('axios');
const http = require('http');
const WebSocket = require('ws');
const basicAuth = require('basic-auth');
const path = require('path');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Cria um servidor WebSocket
const wss = new WebSocket.Server({ server });

// Middleware para permitir CORS
app.use(cors());
app.use(express.json());

// Dados dos sensores
let sensorData = {
    temperatura: null,
    humidade: null,
    ldr: null,
    luz: null,
    hora: null
};

// Middleware para autenticação básica
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
app.use(checkAuth);

// Configuração do cliente MQTT
const mqttBrokerUrl = 'mqtt://mqtt:1883';
const mqttOptions = {
    clientId: "Teste",
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
};
const mqttClient = mqtt.connect(mqttBrokerUrl, mqttOptions);

// Subscreve o tópico sala0/# para receber dados dos sensores
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

    // Envia os dados agregados para todos os clientes WebSocket
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(sensorData));
        }
    });

    // Converte e envia os dados para a API
    const formattedData = formatSensorData(sensorData);
    //sendToApi(formattedData);
});

// Função para formatar os dados do sensor
const formatSensorData = (data) => {
    console.log(
        'Data:', new Date(data.hora).toISOString(),
        'Temperatura:', parseFloat(data.temperatura),
        'Humidade:', parseFloat(data.humidade),
        'lumino:', parseFloat(data.ldr),
        'Luz:', data.luz
    );

    return {
        dataHora: new Date(data.hora).toISOString(),
        temperatura: parseFloat(data.temperatura),
        humidade: parseFloat(data.humidade),
        lumino: data.ldr,
        luz: data.luz
    };
};

// Função para enviar dados para a API
/*const sendToApi = async (data) => {
    try {
        await axios.post('https://localhost:7027/api/dados', data);
        console.log('Dados enviados para a API com sucesso');
    } catch (error) {
        console.error('Erro ao enviar dados para a API:', error);
    }
};*/

// Middleware para servir a aplicação React
app.use(express.static(path.join(__dirname, 'notiipt', 'dist')));

// Rota para testar o servidor
app.get('/test', (req, res) => {
    res.send('API a funcionar..');
});

// Rota para obter os dados dos sensores
app.get('/api/dados', (req, res) => {
    res.json(sensorData);
});

// Rota para controlar a luz
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'notiipt', 'dist', 'index.html'));
});

// Adquire dados do IPMA e ajustar os limites do LDR dada a produção de energia atual do País
const fetchLimitarLDR = async () => {
    try {
        const response = await axios.get('http://api.ipma.pt/open-data/forecast/meteorology/cities/daily/1141600.json');
        const weatherData = response.data.data[0];
        const weatherId = weatherData.idWeatherType;

        let luzOnLimite = 35;
        let luzOffLimite = 45;

        if (weatherId === 1) { // Céu limpo
            luzOnLimite = 45;
            luzOffLimite = 55;
        }

        // Publica os novos limiares para o broker MQTT
        mqttClient.publish('sala0/limite/luzOnLimite', luzOnLimite.toString());
        mqttClient.publish('sala0/limite/luzOffLimite', luzOffLimite.toString());
    } catch (error) {
        console.error('Erro ao adquirir dados do IPMA:', error);
    }
};

// Agendar a função para executar a cada hora
setInterval(fetchLimitarLDR, 30000);
fetchLimitarLDR();

// Rota para controlar a luz
app.post('/api/control', (req, res) => {
    const { luzState, autoMode } = req.body;
    if (autoMode !== undefined) {
        mqttClient.publish('sala0/luz/auto-mode', autoMode.toString());
    }
    if (!autoMode && luzState) {
        mqttClient.publish('sala0/luz/controlo', luzState);
    }
    res.send(`Modo automático ${autoMode ? 'ativado' : 'desativado'}, LUZ ${luzState}`);
});

// Inicia o servidor HTTP na porta 3000
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Servidor HTTP iniciado na porta ${port}`);
});

// Conexão WebSocket
wss.on('connection', (ws) => {
    console.log('Novo cliente WebSocket conectado');

    ws.on('close', () => {
        console.log('Cliente WebSocket desconectado');
    });
});