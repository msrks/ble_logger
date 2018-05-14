"use strict";

const noble = require("noble");
const knownDevices = [];

const logAllDiscovered = peripheral => {
  const device = {
    name: peripheral.advertisement.localName,
    uuid: peripheral.uuid,
    rssi: peripheral.rssi
  };
  knownDevices.push(device);
  console.log(peripheral);
  console.log(
    `${knownDevices.length}:${device.name}(${device.uuid}) RSSI${device.rssi}`
  );
};

const connectToSanwaBLE = peripheral => {
  const device = {
    name: peripheral.advertisement.localName,
    uuid: peripheral.uuid,
    rssi: peripheral.rssi
  };
  knownDevices.push(device);
  console.log(
    `${knownDevices.length}:${device.name}(${device.uuid}) RSSI${device.rssi}`
  );
  if (peripheral.advertisement.localName !== "S1") {
    return;
  }
  peripheral.connect(function (error) {
    console.log("connected to peripheral: " + peripheral.uuid);
    peripheral.discoverServices(["180a"], function (error, services) {
      var deviceInformationService = services[0];
      console.log("discovered device information service");

      deviceInformationService.discoverCharacteristics(["2a29"], (error, characteristics) => {
        var manufacturerNameCharacteristic = characteristics[0];
        console.log("discovered manufacturer name characteristic");
        manufacturerNameCharacteristic.read(function (error, data) {
          console.log("manufacture name is: " + data.toString("utf8"));
        });
      });
    });
  });
};

//BLE scan start
const scanStart = () => {
  noble.startScanning();
  noble.on("discover", connectToSanwaBLE);
};

if (noble.state === "poweredOn") {
  scanStart();
} else {
  noble.on("stateChange", scanStart);
}