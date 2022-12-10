import fetch from 'node-fetch';
import { writeFile } from 'node:fs/promises';

const date = new Date();
const target = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay() + 4}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

const API_URL = 'https://danepubliczne.imgw.pl/api/data/synop';

const cityName = process.argv[2];

const processWeatherData = data => {
  const foundData = data.find(stationData => stationData.stacja === cityName);
  if (!foundData) console.log('Nie znaleziono takiego miasta w bazie!');

  const {
    data_pomiaru: measurementDate,
    godzina_pomiaru: timeOfMeasurement,
    cisnienie: pressurde,
    wilgotnosc_wzgledna: humidity,
    temperatura: temperature } = foundData;

  // const { ...arg } = foundData;
  // if (arg === null) console.log('N/A');

  const weatherInfo = `Measurement data: ${measurementDate},
  Time: ${timeOfMeasurement}.00.
  In ${cityName} there is ${temperature}°, ${humidity}% of humidity, pressure ${pressurde} hPa,`;
  console.log(weatherInfo);
};

try {
  const response = await fetch(API_URL);
  const data = await response.json();
  processWeatherData(data);
} catch (error) {
  await writeFile('./log/log.txt', `${target} - ${error.message}`);
}
