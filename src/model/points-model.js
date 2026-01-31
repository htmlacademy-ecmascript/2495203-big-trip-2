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
  sortByDateAsc,
  filterPoints,
} from '../utils.js';
import {
  FILTER,
  MAIN_INFO_MAX_CITIES, SYMBOL
} from '../constants.js';

export default class PointsModel {
  #tripPoints = mockPoints;
  #blankPoint = blankPoint;
  #pointTypes = pointTypes;
  #cities = cities;
  #adaptedPointsData;
  #adaptedBlankPointData;
  #adaptedPointTypesData;
  #pointEditObserver;
  #pointAddObserver;
  #pointRemoveObserver;
  #filterChangeListObserver;
  #filterChangeSortObserver;
  #defaultFilter = FILTER.EVERYTHING;
  #currentFilter = this.#defaultFilter;

  constructor() {
    this.init();
  }

  get tripPoints() {
    if (this.#currentFilter === this.#defaultFilter) {
      return this.#adaptedPointsData;
    }

    return filterPoints([...this.#adaptedPointsData], this.#currentFilter);
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

  get currentFilter() {
    return this.#currentFilter;
  }

  setPointEditObserver(observer) {
    this.#pointEditObserver = observer;
  }

  setPointAddObserver(observer) {
    this.#pointAddObserver = observer;
  }

  setPointRemoveObserver(observer) {
    this.#pointRemoveObserver = observer;
  }

  setFilterChangeListObserver(observer) {
    this.#filterChangeListObserver = observer;
  }

  setFilterChangeSortObserver(observer) {
    this.#filterChangeSortObserver = observer;
  }

  init() {
    this.#adaptPointsData();
    this.#adaptBlankPointData();
    this.#adaptPointTypesData();
  }

  updatePoint(changedData) {
    this.#adaptedPointsData = [...this.#adaptedPointsData.map((item) => item.id === changedData.id ? changedData : item)];

    this.#pointEditObserver(changedData);
  }

  addPoint(pointData) {
    this.#adaptedPointsData = [
      ...this.#adaptedPointsData,
      pointData
    ];

    this.#pointAddObserver();
  }

  removePoint(pointId) {
    const pointToDelete = this.#adaptedPointsData.find((point) => point.id === pointId);

    this.#adaptedPointsData.splice(this.#adaptedPointsData.indexOf(pointToDelete), 1);
    this.#pointRemoveObserver();
  }

  changeFilter(filterValue) {
    if (filterValue === this.#currentFilter) {
      return;
    }

    this.#currentFilter = filterValue;
    this.#filterChangeListObserver();
    this.#filterChangeSortObserver();
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
    this.#adaptedBlankPointData = structuredClone(this.#blankPoint);
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
        'month': start.month === end.month ? '' : `${SYMBOL.NBSP}${start.month}`,
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
        result += `${index !== 0 ? ` ${SYMBOL.MDASH} ` : ''}`;
        result += city;
      });
      return result;
    }

    result = `${cityNames[0]} ${SYMBOL.MDASH} ${SYMBOL.THREE_DOTS} ${SYMBOL.MDASH} ${cityNames[cityNames.length - 1]}`;
    return result;
  }
}
