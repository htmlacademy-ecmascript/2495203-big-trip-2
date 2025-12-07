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
  formatFormDate
} from '../utils.js';

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
    });
    this.#adaptedPointsData = tripPointsData;
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
}
