import fetch from 'node-fetch';
import { appendFile } from 'node:fs/promises';

const date = new Date();
const fullDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
const fullTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

const API_URL = 'https://danepubliczne.imgw.pl/api/data/synop';

const processWeatherData = async data => {
  const sorted = data.sort((a, b) => b.temperatura - a.temperatura);

  // for (let i = 0; i < sorted.length; i++) {
  //   console.log(`City: ${sorted[i].stacja}, temperature: ${sorted[i].temperatura}°`);
  // }

  sorted.forEach((element, index) => {
    console.log(`City: ${sorted[index].stacja}, temperature: ${sorted[index].temperatura}°`);
  });

  // for (const element in sorted) {
  //   console.log(`City: ${sorted[element].stacja}, temperature: ${sorted[element].temperatura}°`);
  // }
};

const temperatureInCities = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    await processWeatherData(data);
  } catch (error) {
    await appendFile('./log/log-cities.txt', `${fullTime}, ${fullDate} - ${error}\n\n`);
    console.log(`${error.name}. For more information look at log file.`);
  }
};

temperatureInCities();
