(function() {
    'use strict';
  
    class ColorSensor {
      constructor() {
        this.device = null;
        this.server = null;
        this._characteristics = new Map();
      }
      connect() {
        return navigator.bluetooth.requestDevice({ acceptAllDevices: true,
        optionalServices: ['22bdd8de-a1b8-4293-a28f-3d8c6c482686'] })
        .then(device => {
          this.device = device;
          return device.gatt.connect();
        })
        .then(server => {
          this.server = server;
          return Promise.all([
            server.getPrimaryService('22bdd8de-a1b8-4293-a28f-3d8c6c482686').then(service => {
              return Promise.all([
                this._cacheCharacteristic(service, '36d49a0c-0cd7-4778-8784-210f75aa0da4'),
              ])
            })
          ]);
        })
      }
  
      /* Custom Colour Service */
  
    
      startNotificationsColourMeasurement() {
          console.log('startNotificationsColourMeasurement')
        return this._startNotifications('36d49a0c-0cd7-4778-8784-210f75aa0da4');
      }
      stopNotificationsColourMeasurement() {
        console.log('stopNotificationsColourMeasurement')
        return this._stopNotifications('36d49a0c-0cd7-4778-8784-210f75aa0da4');
      }

      toBinary(integer, withPaddingLength) {
        let str = integer.toString(2);
        return str.padStart(withPaddingLength, "0");
      }
     
      parseColor(value) {
        // In Chrome 50+, a DataView is returned instead of an ArrayBuffer.
        var receivedData = new Uint8Array(value.byteLength);
        for (var i = 0; i < value.byteLength; i++) {
            receivedData[i] = value.getUint8(i);
        }
        return receivedData;
      }
      /* Utils */
  
      _cacheCharacteristic(service, characteristicUuid) {
          
        return service.getCharacteristic(characteristicUuid)
        .then(characteristic => {
          this._characteristics.set(characteristicUuid, characteristic);
        });
      }

      _startNotifications(characteristicUuid) {
        let characteristic = this._characteristics.get(characteristicUuid);
        // Returns characteristic to set up characteristicvaluechanged event
        // handlers in the resolved promise.
        return characteristic.startNotifications()
        .then(() => characteristic);
      }
      _stopNotifications(characteristicUuid) {
        let characteristic = this._characteristics.get(characteristicUuid);
        // Returns characteristic to remove characteristicvaluechanged event
        // handlers in the resolved promise.
        return characteristic.stopNotifications()
        .then(() => characteristic);
      }
    }
  
    window.colourSensor = new ColorSensor();
  
  })();