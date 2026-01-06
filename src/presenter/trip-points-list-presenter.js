import {
  render,
  RenderPosition,
} from '../framework/render.js';
import TripPointAddingFormView from '../view/trip-point-adding-form-view.js';
import PointPresenter from './point-presenter.js';
import {
  replaceArrayItem,
  sortByDurationAsc,
  sortByPriceAsc
} from '../utils.js';

const SortCriteria = {
  START_DAY: 'sort-day',
  DURATION: 'sort-time',
  PRICE: 'sort-price'
};

export default class TripPointsListPresenter {
  #listElement = null;
  #pointsModel = null;
  #originPointsData = null;
  #pointsData = null;
  #pointTypes = null;
  #cities = null;
  #addingFormComponent = null;
  #pointPresenters = new Map();
  #currentSortCriteria = SortCriteria.START_DAY;

  constructor({listElement, pointsModel}) {
    this.#listElement = listElement;
    this.#pointsModel = pointsModel;
    this.#originPointsData = [...this.#pointsModel.tripPoints];
    this.#pointsData = [...this.#pointsModel.tripPoints];
    this.#pointTypes = this.#pointsModel.pointTypes;
    this.#cities = this.#pointsModel.cities;
  }

  init() {
    if (this.#pointsData.length) {
      this.#renderPoints(this.#pointsData);
    }
  }

  openAddingForm() {
    this.#addingFormComponent = new TripPointAddingFormView({
      cities: this.#pointsModel.cities,
      pointTypes: this.#pointsModel.pointTypes,
      blankPoint: this.#pointsModel.blankPoint,
    });
    render(this.#addingFormComponent, this.#listElement, RenderPosition.AFTERBEGIN);
  }

  closeAddingForm() {
    if (this.#addingFormComponent) {
      this.#addingFormComponent.removeElement();
    }
  }

  handleSortChange = (sortCriteria) => {
    if (sortCriteria === this.#currentSortCriteria) {
      return;
    }

    this.#currentSortCriteria = sortCriteria;
    this.#applySort(sortCriteria);
  };

  #renderPoints(pointsData) {
    pointsData.forEach((pointData) => {
      this.#renderPoint(pointData);
    });
  }

  #renderPoint(pointData) {
    const pointPresenter = new PointPresenter({
      listElement: this.#listElement,
      handleDataChange: this.#handlePointChange,
      handlePointEditClick: this.#resetAllForms
    });

    pointPresenter.init(pointData, this.#pointTypes, this.#cities);
    this.#pointPresenters.set(pointData.id, pointPresenter);
  }

  #resetAllForms = () => {
    this.#pointPresenters.forEach((point) => {
      point.resetForm();
    });
  };

  #clearPointsList = () => {
    this.#pointPresenters.forEach((point) => {
      point.destroy();
    });
  };

  #applySort = (sortCriteria) => {
    switch (sortCriteria) {
      case SortCriteria.DURATION: {
        this.#pointsData.sort(sortByDurationAsc);
        break;
      }
      case SortCriteria.PRICE: {
        this.#pointsData.sort(sortByPriceAsc);
        break;
      }
      case SortCriteria.START_DAY: {
        this.#pointsData = [...this.#originPointsData];
        break;
      }
    }
    this.#clearPointsList();
    this.#renderPoints(this.#pointsData);
  };

  #handlePointChange = (changedPoint) => {
    this.#pointsData = replaceArrayItem(this.#pointsData, changedPoint);
    this.#pointPresenters.get(changedPoint.id).init(changedPoint, this.#pointTypes, this.#cities);
    this.#applySort(this.#currentSortCriteria);
  };
}
