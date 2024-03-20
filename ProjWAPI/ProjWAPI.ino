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

WiFiClient espClient;
PubSubClient client(espClient);

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP);

DHT20 DHT;

const int ldrPin = 34; // Pino do LDR
const int ledPin = 2;  // Pino do LED
int sensorValue = 0;   // Variável para armazenar o valor do LDR

String formattedDate; // Hora formatada

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
}

void loop() {
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
    Serial.println("Dia");
    digitalWrite(ledPin, LOW); // Apaga o LED durante o dia
  } else {
    Serial.println("Noite");
    digitalWrite(ledPin, HIGH); // Acende o LED durante a noite
  }
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