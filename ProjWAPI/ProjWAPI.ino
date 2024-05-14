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

// Configuração do broker MQTT (Ngrok)
const char* mqtt_server = "192.168.137.200"; // Ip da máquina
const int mqtt_port = 1883;

// Configuração das credenciais do MQTT
const char* mqttuser = MQTT_USERNAME;
const char* mqttpass = MQTT_PASSWORD;

const char* topico = "sala0/";

// Sub-tópicos MQTT para enviar os dados dos sensores
String mqttPubHumidade = String(topico) + "humidade";
String mqttPubTemperatura = String(topico) + "temperatura";
String mqttPubLdr = String(topico) + "ldr";
String mqttPubLed = String(topico) + "led";
String mqttPubHora = String(topico) + "hora";

WiFiClient espClient;
PubSubClient client(espClient);

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);

DHT20 DHT;

const int ldrPin = 34; // Pino do LDR
const int ledPin = 2;  // Pino do LED
int sensorValue = 0;   // Variável para armazenar o valor do LDR

String formattedDate; // Hora formatada

bool ledState = false; // Estado inicial do LED (desligado)

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

  Serial.print("\nHora: ");
  Serial.print(formattedDate);

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
  sensorValue = analogRead(ldrPin);
  Serial.print("Valor lido pelo LDR: ");
  Serial.println(sensorValue);

  // Verifica o valor do LDR e ajusta o LED
  if (sensorValue < 2600) {
    Serial.println("Boa luminusidade");
    digitalWrite(ledPin, LOW); // Apaga o LED se a luminusidade estiver boa
    ledState = false; // Atualiza o estado do LED para desligado
  } else {
    Serial.println("Escuro");
    digitalWrite(ledPin, HIGH); // Acende o LED se estiver escuro
    ledState = true; // Atualiza o estado do LED para ligado
  }

  // Publica os dados dos sensores nos tópicos MQTT
  client.publish(mqttPubHumidade.c_str(), String(humidity, 1).c_str());
  client.publish(mqttPubHumidade.c_str(), String(temperature, 1).c_str());
  client.publish(mqttPubLdr.c_str(), String(sensorValue).c_str());
  client.publish(mqttPubLed.c_str(), ledState ? "Ligado" : "Desligado");
  client.publish(mqttPubHora.c_str(), formattedDate.c_str());
  
  Serial.println("Dados enviados com sucesso para o servidor MQTT");
  delay(10000); // Delay entre leituras
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

// Manipular mensagens recebidas
void callback(char* topic, byte* payload, unsigned int length) {
}
