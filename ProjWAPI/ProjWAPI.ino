#include <WiFi.h>
#include <PubSubClient.h>
#include "DHT20.h"
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <TimeLib.h>
#include "esp_secrets.h"

// Configuração da rede Wi-Fi
const char* ssid = SECRET_SSID;
const char* password = SECRET_PASS;

// Configuração do broker MQTT
const char* mqtt_server = "192.168.137.247"; // Ip da máquina
const int mqtt_port = 1883;

// Configuração das credenciais do MQTT
const char* mqttuser = MQTT_USERNAME;
const char* mqttpass = MQTT_PASSWORD;

const char* topico = "sala0/";

// Sub-tópicos MQTT para enviar os dados dos sensores (PUBLISHERS)
String mqttPubTemperatura = String(topico) + "temperatura";
String mqttPubHumidade = String(topico) + "humidade";
String mqttPubLdr = String(topico) + "ldr";
String mqttPubLuz = String(topico) + "luz/estado";
String mqttPubHora = String(topico) + "hora";

// Sub-tópicos MQTT para receber os dados do Front-End (SUBSCRIBERS)
String mqttSubAutoControl = String(topico) + "auto"; // Tópico de automatização (Ativado ou Desligado)
String mqttSubLuzControl = String(topico) + "luz/controloManual"; // Tópico de Ligar ou Apagar luz manualmente (Ligada ou Apagada)

const char* mqttAutoModeTopic = "sala0/luz/auto-mode"; //********
const char* mqttLuzTopic = "sala0/luz/controlo";       //********
bool autoMode = true;

WiFiClient espClient;
PubSubClient client(espClient);

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "europe.pool.ntp.org", 3600);

DHT20 DHT;

const int ldrPin = 34; // Pino do LDR
const int ledPin = 2;  // Pino do LED
int ldrValue = 0;   // Variável para armazenar o valor do LDR

String formattedDate; // Hora formatada

bool luzState = false; // Estado inicial do LED (desligado)

unsigned long lastSensorReadTime = 0; // Variável para temporização
const unsigned long sensorReadInterval = 10000; // Intervalo de leitura dos sensores em milissegundos

void setup() {
  Serial.begin(115200);

  // Inicialização da conexão Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("A conectar ao WiFi...");
  }
  Serial.println("Ligação ao WiFi estabelecida.");

  pinMode(ldrPin, INPUT);    // Define ldrPin como saída
  pinMode(ledPin, OUTPUT);   // Define o pino do LED como saída

  Wire.begin();   // Ativa o protocolo I2C, necessário para o sensor DHT20
  DHT.begin();    // ESP32 default pins 21 22

  // Inicialização do MQTT
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
  reconnect();

  // Subscreve aos tópicos MQTT relevantes
  client.subscribe(mqttAutoModeTopic);
  client.subscribe(mqttLuzTopic);

  // Inicialização do NTP
  timeClient.begin();
}

void loop() {
  // Verifica se a conexão MQTT está ativa
  if (!client.connected()) {
    reconnect();
  }
  
  // Gere as mensagens MQTT
  client.loop();

  // Obtem a hora atual formatada
  timeClient.update();
  formattedDate = getCurrentTimeString();  

  // Verifica se é hora de ler os sensores
  unsigned long currentMillis = millis();
  if (currentMillis - lastSensorReadTime >= sensorReadInterval) {
    lastSensorReadTime = currentMillis;
    readAndPublishSensorData();
  }
}

void readAndPublishSensorData() {
  // Ler dados dos sensores (Remover provoca a não leitura do DHT20)
  uint32_t start = micros();
  int status = DHT.read();
  uint32_t stop = micros();

  // Leitura do sensor DHT20
  float humidity = DHT.getHumidity();
  float temperature = DHT.getTemperature();

  Serial.print("\nHumidade: ");
  Serial.print(humidity, 1);
  Serial.print(" %\n");
  Serial.print("Temperatura: ");
  Serial.print(temperature, 1);
  Serial.println("°C\n");
  
  // Leitura do sensor LDR
  ldrValue = analogRead(ldrPin);
  // Converte valor lido pelo LDR em percentagem em que 0% é escuro e 100% é claridade
  int ldrPercentagem = map(ldrValue, 0, 4095, 100, 0);
  Serial.print("Valor lido pelo LDR: ");
  Serial.println(ldrPercentagem);

  // Verifica o estado do modo automático antes de ajustar o LED
  if (autoMode) {
    if (ldrPercentagem > 40) {
      digitalWrite(ledPin, LOW); // Apaga o LED
      luzState = false;
    } else if (ldrPercentagem < 35) {
      digitalWrite(ledPin, HIGH); // Acende o LED
      luzState = true;
    }
  }

  // Publica os dados dos sensores nos tópicos MQTT
  client.publish(mqttPubTemperatura.c_str(), String(temperature, 1).c_str());
  client.publish(mqttPubHumidade.c_str(), String(humidity, 1).c_str());
  client.publish(mqttPubLdr.c_str(), String(ldrPercentagem).c_str());
  client.publish(mqttPubLuz.c_str(), luzState ? "Ligada" : "Desligada");
  client.publish(mqttPubHora.c_str(), formattedDate.c_str());
  Serial.println("Dados enviados com sucesso para o servidor MQTT");
}

String getCurrentTimeString() {
  // Recebe a hora atual
  time_t currentTime = timeClient.getEpochTime();

  // Recebe os valores da hora atual separadamente
  int currentHour = hour(currentTime);
  int currentMinute = minute(currentTime);
  int currentSecond = second(currentTime);

  // Recebe a data atual
  int currentDay = day(currentTime);
  int currentWeekday = weekday(currentTime);
  int currentMonth = month(currentTime);
  int currentYear = year(currentTime);

  // Formata a hora atual para string
  String formattedString = String(currentYear) + "-" +
                           getTwoDigitString(currentMonth) + "-" +
                           getTwoDigitString(currentDay) + " " +
                           getTwoDigitString(currentHour) + ":" +
                           getTwoDigitString(currentMinute) + ":" +
                           getTwoDigitString(currentSecond) + "";
  return formattedString;
}

// Função para formatar um número de um dígito para dois dígitos com zero à esquerda
String getTwoDigitString(int number) {
  if (number < 10) {
    return "0" + String(number);
  } else {
    return String(number);
  }
}

// Loop até que o cliente MQTT esteja reconectado
void reconnect() {
  while (!client.connected()) {
    Serial.println("A tentar reconectar ao broker MQTT...");
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str(), mqttuser, mqttpass)) {
      Serial.println("Reconectado com sucesso ao broker MQTT.");
    } else {
      Serial.print("Falha na reconexão ao broker MQTT, estado: ");
      Serial.print(client.state());
      Serial.println("Voltar a tentar reconectar daqui a 15 segundos...");
      delay(15000);
    }
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  if (String(topic) == mqttAutoModeTopic) {
    Serial.print("Modo automático: ");
    if (message == "true") {
      Serial.println("ativado");
      autoMode = true;
    } else {
      Serial.println("desativado");
      autoMode = false;
    }
  }

  if (String(topic) == mqttLuzTopic && !autoMode) {
    Serial.print("Luz: ");
    if (message == "ligar") {
      Serial.println("Acesa");
      digitalWrite(ledPin, HIGH);
      luzState = true;
    } else if (message == "desligar") {
      Serial.println("Apagada");
      digitalWrite(ledPin, LOW);
      luzState = false;
    }
  }
}
