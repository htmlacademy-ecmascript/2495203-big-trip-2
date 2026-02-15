import ApiService from './framework/api-service.js';
import {END_POINT, METHOD} from './constants';

export default class TripApiService extends ApiService {
  get points() {
    return this._load({
      url: END_POINT.POINTS,
    })
      .then(ApiService.parseResponse);
  }

  get cities() {
    return this._load({
      url: END_POINT.CITIES
    })
      .then(ApiService.parseResponse);
  }

  get pointTypes() {
    return this._load({
      url: END_POINT.POINT_TYPES
    })
      .then(ApiService.parseResponse);
  }

  async updatePoint(pointData) {
    const response = await this._load({
      url: `${END_POINT.POINTS}/${pointData.id}`,
      method: METHOD.PUT,
      body: JSON.stringify(pointData),
      headers: new Headers({'Content-Type': 'application/json'})
    });

    return await ApiService.parseResponse(response);
  }

  async deletePoint(pointId) {
    return await this._load({
      url: `${END_POINT.POINTS}/${pointId}`,
      method: METHOD.DELETE,
    });
  }
}
