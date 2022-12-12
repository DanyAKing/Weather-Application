import fetch from 'node-fetch';
import { appendFile } from 'node:fs/promises';

const date = new Date();
const fullDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
const fullTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

const API_URL = 'https://danepubliczne.imgw.pl/api/data/synop';

const processWeatherData = async data => {
  const sorted = data.sort((a, b) => b.temperatura - a.temperatura);

  const {
    data_pomiaru: dateOfMeasurment,
    godzina_pomiaru: timeOfMeasurement,

    stacja: warnestCity,
    temperatura: warnestTemperature,
  } = sorted[0];

  const {
    stacja: coldestCity,
    temperatura: coldestTemperature,
  } = sorted[sorted.length - 1];

  console.log(`${dateOfMeasurment}, ${timeOfMeasurement}.00\nThe warnest city is ${warnestCity}, temperature is ${warnestTemperature}°.\nThe coldest city is ${coldestCity}, temperature is ${coldestTemperature}°.`);
};

const warnestPlacesInPoland = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    await processWeatherData(data);
  } catch (error) {
    await appendFile('./log/log-warnest.txt', `${fullTime}, ${fullDate} - ${error}\n\n`);
    console.log(`${error.name}. For more information look at log file.`);
  }
};

warnestPlacesInPoland();
