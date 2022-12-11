import fetch from 'node-fetch';
import { appendFile } from 'node:fs/promises';

const date = new Date();
const target = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay() + 4}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

const API_URL = 'https://danepubliczne.imgw.pl/api/data/synop';

const cityName = process.argv[2];

const processWeatherData = data => {
  const foundData = data.find(stationData => stationData.stacja === cityName);
  if (!foundData) console.log('Nie znaleziono takiego miasta w bazie!');

  // eslint-disable-next-line no-restricted-syntax
  for (const element in foundData) {
    if (foundData[element] === null) foundData[element] = 'N/A';
  }

  const {
    data_pomiaru: measurementDate,
    godzina_pomiaru: timeOfMeasurement,
    cisnienie: pressurde,
    wilgotnosc_wzgledna: humidity,
    temperatura: temperature,
  } = foundData;

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
  await appendFile('./log/log.txt', `${target} - ${error.message}\n`);
}
