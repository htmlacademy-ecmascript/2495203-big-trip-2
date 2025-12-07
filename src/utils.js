import {
  HOURS_IN_DAY,
  MINUTES_IN_HOUR,
  RANDOM_CITY_PICTURES_AMOUNT_DEFAULT,
  RANDOM_INT_MAX_RANGE_DEFAULT,
  RANDOM_INT_MIN_RANGE_DEFAULT,
  RANDOM_PICTURE_MAX_RANGE,
  RANDOM_SENTENCES_DEFAULT_AMOUNT
} from './constants.js';
import dayjs from 'dayjs';

export function getRandomInteger(min = RANDOM_INT_MIN_RANGE_DEFAULT, max = RANDOM_INT_MAX_RANGE_DEFAULT) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomArrayElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomSentences(array, amount = RANDOM_SENTENCES_DEFAULT_AMOUNT) {
  let resultText = '';

  for (let i = 0; i < amount; i++) {
    resultText += getRandomArrayElement(array);
    if (amount - i !== 1) {
      resultText += ' ';
    }
  }

  return resultText;
}

export function getRandomPicture() {
  return `https://loremflickr.com/248/152?random=${getRandomInteger(null, RANDOM_PICTURE_MAX_RANGE)}`;
}

export function getCityPhotos(amount = RANDOM_CITY_PICTURES_AMOUNT_DEFAULT) {
  const resultPhotos = [];

  for (let i = 0; i < amount; i++) {
    resultPhotos.push(getRandomPicture());
  }
  return resultPhotos;
}

export function getTripPointFormattedDate(date) {
  return dayjs(date).format('MMM D');
}

export function getHTMLDatetime(date) {
  return dayjs(date).format('YYYY-MM-DD');
}

export function getTime(date) {
  return dayjs(date).format('HH:mm');
}

export function formatDateDifference(start, end) {
  const startInstance = dayjs(start);
  const endInstance = dayjs(end);
  let resultDifferenceTime = '';
  let hoursAmount = '';
  let daysAmount = '';
  const differenceInMinutes = endInstance.diff(startInstance, 'minutes');
  const minutesAmount = differenceInMinutes % MINUTES_IN_HOUR;
  resultDifferenceTime += `${minutesAmount}M`;
  if (Math.floor(differenceInMinutes / MINUTES_IN_HOUR) > 0) {
    const differenceInHours = endInstance.diff(startInstance, 'hours');
    hoursAmount = differenceInHours % HOURS_IN_DAY;
    resultDifferenceTime = `${hoursAmount}H ${resultDifferenceTime}`;
    if (Math.floor(differenceInHours / HOURS_IN_DAY) > 0) {
      daysAmount = Math.floor(differenceInHours / HOURS_IN_DAY);
      resultDifferenceTime = `${daysAmount}D ${resultDifferenceTime}`;
    }
  }

  return resultDifferenceTime;
}

export function formatFormDate(date) {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
}

export function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
