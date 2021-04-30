#include <Arduino_APDS9960.h>
#include <ArduinoBLE.h>

const int UPDATE_FREQUENCY = 100;
long previousMillis = 0;

BLEService customService("22bdd8de-a1b8-4293-a28f-3d8c6c482686"); // create service
// create characteristic and allow remote device to read and write
BLEIntCharacteristic customCharacteristic("36d49a0c-0cd7-4778-8784-210f75aa0da4",  BLERead | BLENotify);

void setup() {
  Serial.begin(9600);
  if (!APDS.begin()) {
    Serial.println("Error initializing APDS9960 sensor!");
  }

  if (!BLE.begin()) {
    Serial.println("starting BLE failed!");
    while (1);
  }

  // set the local name peripheral advertises
  BLE.setLocalName("Nano33BLESENSE");
  // set the UUID for the service this peripheral advertises:
  BLE.setAdvertisedService(customService);

  // add the characteristics to the service
  customService.addCharacteristic(customCharacteristic);

  // add the service
  BLE.addService(customService);

  customCharacteristic.writeValue(0);

  // start advertising
  BLE.advertise();

  Serial.println("Bluetooth device active, waiting for connections...");
}


int convertToBinary(int r,int g,int b) {
  int rgb = r;
  rgb = (rgb << 8) + g;
  rgb = (rgb << 8) + b;
  return rgb;
}

void loop() {
  BLEDevice central = BLE.central();  // Wait for a BLE central to connect
  
  // If central is connected to peripheral
  if (central) {
    Serial.println("Central connected");
  
    while (central.connected()) {
      long currentMillis = millis();
      // Check temperature & humidity with UPDATE_FREQUENCY
      if (currentMillis - previousMillis >= UPDATE_FREQUENCY) {
        previousMillis = currentMillis;

        if (APDS.colorAvailable()) {
            int r, g, b, a;
            // read the color
            APDS.readColor(r, g, b);
            int binColor = convertToBinary(r,g,b);
            //customCharacteristic.writeValue(r);
            customCharacteristic.writeValue(binColor);
            Serial.println(binColor);
            Serial.print(r);
            Serial.print(", ");
            Serial.print(g);
            Serial.print(", ");
            Serial.println(b);
            
        }       
      }
    }
    Serial.println("Central disconnected");
  }
  // check if a color reading is available
  
}
