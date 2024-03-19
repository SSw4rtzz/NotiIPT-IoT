#include <WiFi.h>
#include <PubSubClient.h>
#include "DHT20.h"
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <TimeLib.h>
#include "DHT20.h"
#include "esp_secrets.h"


// Configuração da rede Wi-Fi
const char* ssid = SECRET_SSID;
const char* password = SECRET_PASS;

WiFiClient espClient;
PubSubClient client(espClient);

WiFiUDP ntpUDP;
  NTPClient timeClient(ntpUDP);


DHT20 DHT;

uint8_t count = 0;
const int ldrPin = 34;       // pin 34
int sensorValue = 0;
const int ledPin = 2;

// Variável de controle do estado do LED para o MQTT
// bool ledState = false;

void setup()
{
  Serial.begin(115200);

  // Inicialização da conexão Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("A conectar ao WiFi...");
  }
  
      Serial.println("");
      Serial.println("Ligação ao WiFi estabelecida.");



  pinMode(ldrPin, OUTPUT);    // Define ldrPin como saída
  Wire.begin();
  DHT.begin();    //  ESP32 default pins 21 22

  // Define o pino do led como saída
  pinMode(ledPin, OUTPUT);

  delay(1000);
}

void loop() {


  // Status do led para o MQTT
    //int ledStatus = digitalRead(ledPin);

  // Leitura do sensor DHT20
  if (millis() - DHT.lastRead() >= 1000)
  {
    //  Ler dados dos sensores
    uint32_t start = micros();
    int status = DHT.read();
    uint32_t stop = micros();

    if ((count % 10) == 0)
    {
      count = 0;
      Serial.println();
      Serial.println("Type\tHumidity (%)\tTemp (°C)\tTime (µs)\tStatus");
    }
    count++;

    Serial.print("DHT20 \t");
    //  DISPLAY DATA, sensor has only one decimal.
    Serial.print(DHT.getHumidity(), 1);
    Serial.print("\t\t");
    Serial.print(DHT.getTemperature(), 1);
    Serial.print("\t\t");
    Serial.print(stop - start);
    Serial.print("\t\t");
    switch (status)
    {
      case DHT20_OK:
        Serial.print("OK");
        break;
      case DHT20_ERROR_CHECKSUM:
        Serial.print("Checksum error");
        break;
      case DHT20_ERROR_CONNECT:
        Serial.print("Connect error");
        break;
      case DHT20_MISSING_BYTES:
        Serial.print("Missing bytes");
        break;
      case DHT20_ERROR_BYTES_ALL_ZERO:
        Serial.print("All bytes read zero");
        break;
      case DHT20_ERROR_READ_TIMEOUT:
        Serial.print("Read time out");
        break;
      case DHT20_ERROR_LASTREAD:
        Serial.print("Error read too fast");
        break;
      default:
        Serial.print("Unknown error");
        break;
    }
    Serial.print("\n");
  }

  sensorValue = analogRead(ldrPin);    // Lê o valor do sensor LDR e armazena na variável sensorValue
  Serial.print("Valor lido pelo LDR: ");
  Serial.println(sensorValue);
  
  if (sensorValue < 2600) {
    Serial.println("Dia");    // Se o valor do LDR for menor que 2600, considera-se que está de dia
    digitalWrite(ledPin, LOW); // Apaga o led
  } else if (sensorValue >= 2500 && sensorValue < 3000) {
    Serial.println("Nublado/Nascer ou pôr do sol");    // Se o valor do LDR estiver entre 2500 e 3000, considera-se que está nublado ou no nascer ou pôr do sol
  } else {
    Serial.println("Noite");    // Se o valor do LDR for maior ou igual a 3000, considera-se que está de noite (O sensor vai de 0 a 4095)
    digitalWrite(ledPin, HIGH); // Acende o led
  }
  
  delay(10000);
}
