import {mockPoints} from '../mock/points.js';
import {blankPoint} from '../mock/blank-point.js';
import {pointTypes} from '../mock/point-types.js';
import {cities} from '../mock/cities.js';
import {
  getTripPointFormattedDate,
  getHTMLDatetime,
  getTime,
  formatDateDifference,
  capitalizeFirstLetter,
  formatFormDate,
  getMainInfoFormattedDate,
  sortByDateAsc
} from '../utils.js';
import {MAIN_INFO_MAX_CITIES} from '../constants.js';

export default class PointsModel {
  #tripPoints = mockPoints;
  #blankPoint = blankPoint;
  #pointTypes = pointTypes;
  #cities = cities;
  #adaptedPointsData = null;
  #adaptedBlankPointData = null;
  #adaptedPointTypesData = null;

  constructor() {
    this.init();
  }

  get tripPoints() {
    return this.#adaptedPointsData;
  }

  get blankPoint() {
    return this.#adaptedBlankPointData;
  }

  get pointTypes() {
    return this.#adaptedPointTypesData;
  }

  get cities() {
    return structuredClone(this.#cities);
  }

  get pointsCount() {
    return this.#adaptedPointsData.length;
  }

  get mainInfo() {
    return {
      'dates': this.#getMainInfoDates(),
      'cities': this.#getMainInfoCities()
    };
  }

  init() {
    this.#adaptPointsData();
    this.#adaptBlankPointData();
    this.#adaptPointTypesData();
  }

  #adaptPointsData() {
    const tripPointsData = structuredClone(this.#tripPoints);
    tripPointsData.forEach((pointData) => {
      pointData.formattedDate = getTripPointFormattedDate(pointData.startDate);
      pointData.startDateISO = pointData.startDate.toISOString();
      pointData.endDateISO = pointData.endDate.toISOString();
      pointData.htmlStartDate = getHTMLDatetime(pointData.startDate);
      pointData.htmlEndDate = getHTMLDatetime(pointData.endDate);
      pointData.duration = formatDateDifference(pointData.startDate, pointData.endDate);
      pointData.startTime = getTime(pointData.startDate);
      pointData.endTime = getTime(pointData.endDate);
      pointData.formStartDate = formatFormDate(pointData.startDate);
      pointData.formEndDate = formatFormDate(pointData.endDate);
      pointData.headerFormattedStartDate = getMainInfoFormattedDate(pointData.startDate);
      pointData.headerFormattedEndDate = getMainInfoFormattedDate(pointData.endDate);
    });
    this.#adaptedPointsData = tripPointsData.sort(sortByDateAsc);
  }

  #adaptBlankPointData() {
    const blankPointData = structuredClone(this.#blankPoint);
    blankPointData.type.capitalizedName = capitalizeFirstLetter(blankPointData.type.name);
    blankPointData.formattedStartDate = formatFormDate(blankPointData.startDate);
    blankPointData.formattedEndDate = formatFormDate(blankPointData.endDate);
    this.#adaptedBlankPointData = blankPointData;
  }

  #adaptPointTypesData() {
    const pointTypesData = structuredClone(this.#pointTypes);
    pointTypesData.forEach((typeData) => {
      typeData.capitalizedName = capitalizeFirstLetter(typeData.name);
    });
    this.#adaptedPointTypesData = pointTypesData;
  }

  #getMainInfoDates() {
    if (!this.#adaptedPointsData.length) {
      return;
    }
    const start = this.#adaptedPointsData[0].headerFormattedStartDate;
    const end = this.#adaptedPointsData[this.#adaptedPointsData.length - 1].headerFormattedEndDate;

    if (this.#adaptedPointsData.length === 1) {
      return {
        'start': {
          'day': start.day,
          'month': start.month
        }
      };
    }

    return {
      'start': {
        'day': start.day,
        'month': start.month === end.month ? '' : `&nbsp;${start.month}`,
      },
      'end': {
        'day': end.day,
        'month': end.month
      }
    };
  }

  #getMainInfoCities() {
    const cityNames = this.#adaptedPointsData.map((point) => point.destination.cityName);
    let result = '';

    if (cityNames.length <= MAIN_INFO_MAX_CITIES) {
      cityNames.forEach((city, index) => {
        result += `${index !== 0 ? ' &mdash; ' : ''}`;
        result += city;
      });
      return result;
    }
    result = `${cityNames[0]} &mdash; ... &mdash; ${cityNames[cityNames.length - 1]}`;

    return result;
  }
}
