import fetch from 'node-fetch';

const API_URL = 'https://danepubliczne.imgw.pl/api/data/synop';

const cityName = process.argv[2];

const processWeatherData = data => {
  const foundData = data.find(stationData => {
    stationData.stacja === cityName ? console.log(foundData) : console.log('We can not search this city');
  });
};

const response = await fetch(API_URL);
const data = await response.json();
processWeatherData(data);
