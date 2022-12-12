import fetch from 'node-fetch';
import { appendFile, writeFile } from 'node:fs/promises';
import { normalize, resolve } from 'node:path';

const date = new Date();
const fullDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
const fullTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

const API_URL = 'https://danepubliczne.imgw.pl/api/data/synop';

const safeJoin = (base, target) => {
  const targetPath = '.' + ('/' + target);
  return resolve(base, targetPath);
};

const getDataFileName = async (city, content) => {
  try {
    await appendFile(safeJoin(`./weather-history/`, `${city}.txt`), `${content}\n\n`);
  } catch (error) {
    await appendFile('./log/log.txt', `${fullTime}, ${fullDate} - ${error}\n\n`);
    setTimeout(() => {
      console.log(error.message);
    }, 1000);
  }
};

const processWeatherData = async (data, cityName) => {
  const foundData = data.find(stationData => stationData.stacja === cityName);
  if (!foundData) console.log('There is no such city in our API!');

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

  getDataFileName(cityName, weatherInfo);
};

const checkCityWeather = async cityName => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    await processWeatherData(data, cityName);
  } catch (error) {
    await appendFile('./log/log.txt', `${fullTime}, ${fullDate} - ${error}\n\n`);
    console.log(`${error.name}. For more information look at log file.`);
  }
};

checkCityWeather(process.argv[2]);