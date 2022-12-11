import fetch from 'node-fetch';
import { appendFile, writeFile } from 'node:fs/promises';

const date = new Date();
const fullDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
const fullTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

const API_URL = 'https://danepubliczne.imgw.pl/api/data/synop';

const cityName = process.argv[2];

const processWeatherData = async data => {
  const foundData = data.find(stationData => stationData.stacja === cityName);

  try {
    await writeFile(`./weather-history/${foundData.data_pomiaru}-${foundData.godzina_pomiaru}-${foundData.stacja}.txt`, JSON.stringify(foundData));
  } catch (error) {
    await appendFile('./log/log.txt', `${fullTime}, ${fullDate} - ${error}\n\n`);
    setTimeout(() => {
      console.log(error.message);
    }, 1000);
  }

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
  await appendFile('./log/log.txt', `${fullTime}, ${fullDate} - ${error}\n\n`);
  console.log(`${error.name}. For more information look at log file.`);
}
