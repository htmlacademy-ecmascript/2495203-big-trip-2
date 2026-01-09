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
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

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

export function getMainInfoFormattedDate(date) {
  return {
    'day': dayjs(date).format('D'),
    'month': dayjs(date).format('MMM')
  };
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

export function replaceArrayItem(items, newItem) {
  return items.map((item) => item.id === newItem.id ? newItem : item);
}

export function sortByDateAsc(a, b) {
  return a.startDate - b.startDate;
}

export function sortByPriceAsc(a, b) {
  return a.price - b.price;
}

export function sortByDurationAsc(a, b) {
  const firstDuration = a.endDate - a.startDate;
  const secondDuration = b.endDate - b.startDate;

  return firstDuration - secondDuration;
}

export function getIconSrcByEventType(typeName) {
  return `img/icons/${typeName}.png`;
}

export function initFlatpickr(component) {
  const startInput = component.element.querySelector('#event-start-time');
  const endInput = component.element.querySelector('#event-end-time');

  flatpickr(startInput, {
    defaultDate: component.state.startDate ?? '',
    defaultHour: component.state.startTime ? component.state.startTime.split(':')[0] : '',
    defaultMinute: component.state.startTime ? component.state.startTime.split(':')[1] : '',
    enableTime: true,
    dateFormat: 'd/m/Y H:i',
    minDate: 'today',
    onChange: (selectedDates) => {
      const newDate = selectedDates[0];
      const isToChangeEndDate = newDate > component.state.endDate;

      component.updateElement({
        startDate: newDate,
        endDate: isToChangeEndDate ? newDate : component.state.endDate,
        formattedDate: getTripPointFormattedDate(newDate),
        startDateISO: newDate.toISOString(),
        endDateISO: isToChangeEndDate ? newDate.toISOString() : component.state.endDateISO,
        htmlStartDate: getHTMLDatetime(newDate),
        htmlEndDate: isToChangeEndDate ? getHTMLDatetime(newDate) : component.state.htmlEndDate,
        startTime: getTime(newDate),
        endTime: isToChangeEndDate ? getTime(newDate) : component.state.endTime,
        formStartDate: formatFormDate(newDate),
        formEndDate: isToChangeEndDate ? formatFormDate(newDate) : component.state.formEndDate,
        headerFormattedStartDate: getMainInfoFormattedDate(newDate),
        headerFormattedEndDate: isToChangeEndDate ? getMainInfoFormattedDate(newDate) : component.state.headerFormattedEndDate,
      });
      component.state = {
        duration: formatDateDifference(component.state.startDate, component.state.endDate)
      };
    }
  });

  flatpickr(endInput, {
    defaultDate: component.state.endDate ?? '',
    defaultHour: component.state.endTime ? component.state.endTime.split(':')[0] : '',
    defaultMinute: component.state.endTime ? component.state.endTime.split(':')[1] : '',
    enableTime: true,
    dateFormat: 'd/m/Y H:i',
    minDate: component.state.startDate ?? 'today',
    onChange: (selectedDates) => {
      const newDate = selectedDates[0];

      component.updateElement({
        endDate: newDate,
        startDate: component.state.startDate ?? newDate,
        endDateISO: newDate.toISOString(),
        startDateISO: component.state.startDateISO ?? newDate.toISOString(),
        htmlEndDate: getHTMLDatetime(newDate),
        htmlStartDate: component.state.htmlStartDate ?? getHTMLDatetime(newDate),
        duration: formatDateDifference(component.state.startDate ?? newDate, newDate),
        endTime: getTime(newDate),
        startTime: component.state.startTime ?? getTime(newDate),
        formEndDate: formatFormDate(newDate),
        formStartDate: component.state.formStartDate ?? formatFormDate(newDate),
        headerFormattedEndDate: getMainInfoFormattedDate(newDate),
        headerFormattedStartDate: component.state.headerFormattedStartDate ?? getMainInfoFormattedDate(newDate)
      });
    }
  });
}
