require('date-utils');
const Decimal = require('decimal.js');
const noble = require('noble');
const axios = require("axios");

const url = "http://localhost:3000/blesensor";
const sensorInterval = 5000; // 5000ms

const logBleSensor = peripheral => {
  const serviceData = peripheral.advertisement.serviceData;
  if (serviceData && serviceData.length && serviceData[0].uuid === 'ffe2') {
    const s = serviceData[0].data.toString('hex');
    const now = new Date().toFormat("YYYYMMDDHH24MISS");
    const sensorData = {
      id: parseInt(now),
      address: peripheral.address,
      battery: Decimal('0x' + s.slice(4, 6)),
      temp: Decimal('0x' + s.slice(6, 8) + '.' + s.slice(8, 10)),
      humid: Decimal('0x' + s.slice(10, 12) + '.' + s.slice(12, 14))
    }
    console.log()
    console.log('Now: ' + sensorData.date)
    console.log('Mac Address: ' + sensorData.address);
    console.log(`Battery: ${sensorData.battery} %`); // 0x64 = 100%
    console.log(`Temperature: ${sensorData.temp} deg`); // 0x19.73 = 25.44deg
    console.log(`Humidity: ${sensorData.humid} %`); // 0x48.64 = 72.39%

    axios.post(url, sensorData)
      .then(response => console.log(response.data))
      .catch(error => console.log(error));
  }
}

noble.on('stateChange', state => {
  if (state === 'poweredOn') {
    noble.startScanning();
    setInterval(()=>noble.startScanning(), sensorInterval);
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', logBleSensor)
