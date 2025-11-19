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
  formatAddingFormDate
} from '../utils.js';


export default class PointsModel {
  tripPoints = mockPoints;
  blankPoint = blankPoint;
  pointTypes = pointTypes;
  cities = cities;

  getTripPoints() {
    const tripPointsData = structuredClone(this.tripPoints);
    tripPointsData.forEach((pointData) => {
      pointData.formattedDate = getTripPointFormattedDate(pointData.startDate);
      pointData.startDateISO = pointData.startDate.toISOString();
      pointData.endDateISO = pointData.endDate.toISOString();
      pointData.htmlStartDate = getHTMLDatetime(pointData.startDate);
      pointData.htmlEndDate = getHTMLDatetime(pointData.endDate);
      pointData.duration = formatDateDifference(pointData.startDate, pointData.endDate);
      pointData.startTime = getTime(pointData.startDate);
      pointData.endTime = getTime(pointData.endDate);
    });
    return tripPointsData;
  }

  getBlankPoint() {
    const blankPointData = structuredClone(this.blankPoint);
    blankPointData.type.capitalizedName = capitalizeFirstLetter(blankPointData.type.name);
    blankPointData.formattedStartDate = formatAddingFormDate(blankPointData.startDate);
    blankPointData.formattedEndDate = formatAddingFormDate(blankPointData.endDate);
    return blankPointData;
  }

  getPointTypes() {
    const pointTypesData = structuredClone(this.pointTypes);
    pointTypesData.forEach((typeData) => {
      typeData.capitalizedName = capitalizeFirstLetter(typeData.name);
    });
    return pointTypesData;
  }

  getCities() {
    return structuredClone(this.cities);
  }
}
