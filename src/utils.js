import {
  FILTER, FORMATS,
  HOURS_IN_DAY,
  MINUTES_IN_HOUR,
} from './constants.js';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export function getTripPointFormattedDate(date) {
  return dayjs(date).format(FORMATS.POINT_DATE);
}

export function getMainInfoFormattedDate(date) {
  return {
    'day': dayjs(date).format(FORMATS.DAY),
    'month': dayjs(date).format(FORMATS.MONTH)
  };
}

export function getHTMLDatetime(date) {
  return dayjs(date).format(FORMATS.FULL_DATE_HYPHEN);
}

export function getTime(date) {
  return dayjs(date).format(FORMATS.TIME);
}

export function getDateWithoutTime(date) {
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return dayjs(date).format(FORMATS.FULL_DATE_HYPHEN);
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
  return dayjs(date).format(FORMATS.FORM_DATETIME);
}

export function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
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

  component.startPicker = flatpickr(startInput, {
    defaultDate: component.state.startDate ?? '',
    defaultHour: component.state.startTime ? component.state.startTime.split(':')[0] : '',
    defaultMinute: component.state.startTime ? component.state.startTime.split(':')[1] : '',
    enableTime: true,
    dateFormat: FORMATS.FLATPICKR_DATE,
    minDate: 'today',
    onOpen: (selectedDates, dateStr, instance) => {
      instance.setDate(instance.config.now, true, instance.config.dateFormat);
    },
    onClose: (selectedDates) => {
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
  component.endPicker = flatpickr(endInput, {
    defaultDate: component.state.endDate ?? '',
    defaultHour: component.state.endTime ? component.state.endTime.split(':')[0] : '',
    defaultMinute: component.state.endTime ? component.state.endTime.split(':')[1] : '',
    enableTime: true,
    dateFormat: FORMATS.FLATPICKR_DATE,
    minDate: component.state.startDate ?? 'today',
    onOpen: (selectedDates, dateStr, instance) => {
      instance.setDate(component.startPicker.selectedDates[0] ?? instance.config.now, true, instance.config.dateFormat);
    },
    onClose: (selectedDates) => {
      const newDate = selectedDates[0];

      component.updateElement({
        endDate: newDate,
        startDate: component.state.startDate ?? newDate,
        endDateISO: newDate.toISOString(),
        startDateISO: component.state.startDateISO ?? newDate.toISOString(),
        formattedDate: getTripPointFormattedDate(component.state.startDate ?? newDate),
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

export function filterPoints(points, filterValue) {
  switch (filterValue) {
    case FILTER.FUTURE:
      return [...points.filter((point) => getDateWithoutTime(new Date) < getDateWithoutTime(point.startDate))];
    case FILTER.PRESENT:
      return [...points.filter((point) => {
        const currentDate = getDateWithoutTime(new Date);
        const pointStartDate = getDateWithoutTime(point.startDate);
        const pointEndDate = getDateWithoutTime(point.endDate);

        return pointStartDate <= currentDate && pointEndDate >= currentDate;
      })];
    case FILTER.PAST:
      return [...points.filter((point) => getDateWithoutTime(new Date) > getDateWithoutTime(point.startDate))];
  }
}
