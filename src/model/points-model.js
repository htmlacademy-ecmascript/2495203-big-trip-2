import {mockPoints} from '../mock/points.js';
import {blankPoint} from '../mock/blank-point.js';
import {pointTypes} from '../mock/point-types.js';
import {cities} from '../mock/cities.js';

export default class PointsModel {
  tripPoints = mockPoints;
  blankPoint = blankPoint;
  pointTypes = pointTypes;
  cities = cities;

  getTripPoints() {
    return this.tripPoints;
  }

  getBlankPoint() {
    return this.blankPoint;
  }

  getPointTypes() {
    return this.pointTypes;
  }

  getCities() {
    return this.cities;
  }
}
