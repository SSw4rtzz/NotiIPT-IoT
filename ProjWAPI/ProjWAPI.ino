#include <WiFi.h>
#include <PubSubClient.h>
#include "DHT20.h"
#include <NTPClient.h>
#include <WiFiUdp.h>
#include <TimeLib.h>

#include "DHT20.h"

DHT20 DHT;

uint8_t count = 0;
const int ldrPin = 34;       // pin 34
int sensorValue = 0;

void setup()
{
  Serial.begin(115200);

  pinMode(ldrPin, OUTPUT);    // Define ldrPin como saída
  Wire.begin();
  DHT.begin();    //  ESP32 default pins 21 22

  delay(1000);
}

void loop() {

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
  } else if (sensorValue >= 2500 && sensorValue < 3000) {
    Serial.println("Nublado/Nascer ou pôr do sol");    // Se o valor do LDR estiver entre 2500 e 3000, considera-se que está nublado ou no nascer ou pôr do sol
  } else {
    Serial.println("Noite");    // Se o valor do LDR for maior ou igual a 3000, considera-se que está de noite (O sensor vai de 0 a 4095)
  }
  
  delay(300);
}
