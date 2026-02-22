import {
  getTripPointFormattedDate,
  getHTMLDatetime,
  getTime,
  formatDuration,
  capitalizeFirstLetter,
  formatFormDate,
  getMainInfoFormattedDate,
  sortByDateAsc,
  filterPoints, getFuturePoints, getPresentPoints, getPastPoints,
} from '../utils.js';
import {
  FILTER, INITIAL_TRIP_COST,
  MAIN_INFO_MAX_CITIES, SYMBOL
} from '../constants.js';

export default class PointsModel {
  #tripApiService;
  #tripPoints;
  #pointTypes;
  #cities;
  #adaptedPointsData;
  #adaptedBlankPointData;
  #adaptedPointTypesData;
  #adaptedCities;
  #pointEditObserver;
  #pointAddObserver;
  #pointRemoveObserver;
  #filterChangeListObserver;
  #filterChangeSortObserver;
  #mainInfoChangeObserver;
  #pointsUpdateFilterObserver;
  #defaultFilter = FILTER.EVERYTHING;
  #currentFilter = this.#defaultFilter;
  #filterStatus = {
    [FILTER.EVERYTHING]: false,
    [FILTER.FUTURE]: false,
    [FILTER.PRESENT]: false,
    [FILTER.PAST]: false,
  };

  constructor({tripApiService}) {
    this.#tripApiService = tripApiService;
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
    return structuredClone(this.#adaptedCities);
  }

  get pointsCount() {
    return this.#adaptedPointsData.length;
  }

  get mainInfo() {
    return {
      'dates': this.#getMainInfoDates(),
      'cities': this.#getMainInfoCities(),
      'cost': this.#getTripCost()
    };
  }

  get currentFilter() {
    return this.#currentFilter;
  }

  get filterStatus() {
    return this.#filterStatus;
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

  setMainInfoChangeObserver(observer) {
    this.#mainInfoChangeObserver = observer;
  }

  setPointsUpdateFilterObserver(observer) {
    this.#pointsUpdateFilterObserver = observer;
  }

  async init() {
    try {
      const [points, pointTypes, cities] = await Promise.all([
        this.#tripApiService.points,
        this.#tripApiService.pointTypes,
        this.#tripApiService.cities
      ]);

      this.#tripPoints = [...points];
      this.#pointTypes = [...pointTypes];
      this.#cities = [...cities];

      this.#adaptPointTypesDataToClient();
      this.#adaptCitiesDataToClient();
      this.#adaptPointsDataToClient();
      this.#adaptBlankPointDataToClient();
      this.#updateFilterStatus();
    } catch (err) {
      this.#tripPoints = [];
      this.#pointTypes = [];
      this.#cities = [];
    }
  }

  async updatePoint(changedData) {
    try {
      const adaptedPoint = this.#adaptPointToServer(changedData);
      const response = await this.#tripApiService.updatePoint(adaptedPoint);

      this.#adaptPointToClient(response);
      this.#adaptedPointsData = [...this.#adaptedPointsData.map((item) => item.id === response.id ? response : item)];
      this.#pointEditObserver(changedData);
      this.#mainInfoChangeObserver();
      this.#updateFilterStatus();
    } catch (err) {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(pointData) {
    try {
      const response = await this.#tripApiService.addPoint(this.#adaptPointToServer(pointData, true));

      this.#adaptPointToClient(response);
      this.#adaptedPointsData = [
        ...this.#adaptedPointsData,
        response
      ];
      this.#pointAddObserver();
      this.#mainInfoChangeObserver();
      this.#updateFilterStatus();
    } catch (error) {
      throw new Error('Can\'t add new point');
    }
  }

  async removePoint(pointId) {
    try {
      await this.#tripApiService.deletePoint(pointId);

      const pointToDelete = this.#adaptedPointsData.find((point) => point.id === pointId);

      this.#adaptedPointsData.splice(this.#adaptedPointsData.indexOf(pointToDelete), 1);
      this.#pointRemoveObserver();
      this.#mainInfoChangeObserver();
      this.#updateFilterStatus();
    } catch (error) {
      throw new Error(`Can't delete point ${pointId}`);
    }
  }

  changeFilter(filterValue) {
    if (filterValue === this.#currentFilter) {
      return;
    }

    this.#currentFilter = filterValue;
    this.#filterChangeListObserver();
    this.#filterChangeSortObserver();
  }

  #updateFilterStatus() {
    this.#filterStatus = {
      [FILTER.EVERYTHING]: this.#adaptedPointsData.length > 0,
      [FILTER.FUTURE]: getFuturePoints(this.#adaptedPointsData).length > 0,
      [FILTER.PRESENT]: getPresentPoints(this.#adaptedPointsData).length > 0,
      [FILTER.PAST]: getPastPoints(this.#adaptedPointsData).length > 0
    };

    this.#pointsUpdateFilterObserver(this.#filterStatus);
  }

  #adaptPointToClient(pointData) {
    pointData.startDate = new Date(Date.parse(pointData['date_from']));
    pointData.endDate = new Date(Date.parse(pointData['date_to']));
    pointData.price = pointData['base_price'];
    pointData.isFavorite = pointData['is_favorite'];
    pointData.type = structuredClone(this.#adaptedPointTypesData.find((type) => type.name === pointData.type));
    pointData.destination = structuredClone(this.#adaptedCities.find((city) => city.id === pointData.destination));
    pointData.type.options.forEach((option) => {
      if (pointData['offers'].includes(option.id)) {
        option.checked = true;
      }
    });

    pointData.formattedDate = getTripPointFormattedDate(pointData.startDate);
    pointData.startDateISO = pointData.startDate.toISOString();
    pointData.endDateISO = pointData.endDate.toISOString();
    pointData.htmlStartDate = getHTMLDatetime(pointData.startDate);
    pointData.htmlEndDate = getHTMLDatetime(pointData.endDate);
    pointData.duration = formatDuration(pointData.startDate, pointData.endDate);
    pointData.startTime = getTime(pointData.startDate);
    pointData.endTime = getTime(pointData.endDate);
    pointData.formStartDate = formatFormDate(pointData.startDate);
    pointData.formEndDate = formatFormDate(pointData.endDate);
    pointData.headerFormattedStartDate = getMainInfoFormattedDate(pointData.startDate);
    pointData.headerFormattedEndDate = getMainInfoFormattedDate(pointData.endDate);

    delete pointData['base_price'];
    delete pointData['date_from'];
    delete pointData['date_to'];
    delete pointData['is_favorite'];
    delete pointData['offers'];
  }

  #adaptPointsDataToClient() {
    const tripPointsData = [...this.#tripPoints];
    tripPointsData.forEach((pointData) => {
      this.#adaptPointToClient(pointData);
    });
    this.#adaptedPointsData = tripPointsData.sort(sortByDateAsc);
  }

  #adaptBlankPointDataToClient() {
    const typeFlight = this.#adaptedPointTypesData.find((pointType) => pointType.name === 'flight');

    this.#adaptedBlankPointData = {
      type: structuredClone(typeFlight),
      price: 0
    };
  }

  #adaptPointTypesDataToClient() {
    const pointTypesData = structuredClone(this.#pointTypes);
    pointTypesData.forEach((typeData, typeIndex) => {
      typeData.id = typeIndex;
      typeData.name = typeData['type'];
      typeData.options = [...typeData['offers']];
      typeData.capitalizedName = capitalizeFirstLetter(typeData.name);
      typeData.options.forEach((option) => {
        option.name = option.title;
        option.alias = option.id;
        option.checked = false;

        delete option.title;
      });

      delete typeData['type'];
      delete typeData['offers'];
    });
    this.#adaptedPointTypesData = pointTypesData;
  }

  #adaptCitiesDataToClient() {
    const cities = [...this.#cities];

    cities.forEach((city) => {
      city.cityName = city['name'];
      city.photos = structuredClone(city['pictures']);

      delete city['name'];
      delete city['pictures'];
    });

    this.#adaptedCities = cities;
  }

  #adaptPointToServer(point, newPoint = false) {
    const pointData = {
      'id': point.id,
      'base_price': point.price,
      'date_from': point.startDateISO,
      'date_to': point.endDateISO,
      'destination': point.destination.id,
      'is_favorite': point.isFavorite,
      'offers': point.type.options
        .map((option) => {
          if (option.checked) {
            return option.id;
          }
        })
        .filter((option) => option),
      'type': point.type.name,
    };

    if (newPoint) {
      delete pointData.id;
    }

    return pointData;
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

  #getTripCost() {
    return this.#adaptedPointsData.reduce((tripCost, point) => {
      const initialPointPrice = Number(point.price);
      if (!isNaN(initialPointPrice)) {
        tripCost += initialPointPrice;
      }

      for (const option of point.type.options) {
        const optionPrice = Number(option.price);
        const isChecked = option.checked;

        if (!isNaN(optionPrice) && isChecked) {
          tripCost += optionPrice;
        }
      }

      return tripCost;
    }, INITIAL_TRIP_COST);
  }
}
