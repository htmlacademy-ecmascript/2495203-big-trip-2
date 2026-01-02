import {
  render,
  RenderPosition,
} from '../framework/render.js';
import TripPointAddingFormView from '../view/trip-point-adding-form-view.js';
import PointPresenter from './point-presenter.js';
import {updateDataItem} from '../utils.js';

export default class TripPointsListPresenter {
  #listElement = null;
  #pointsModel = null;
  #pointsData = null;
  #pointTypes = null;
  #cities = null;
  #addingFormComponent = null;
  #pointPresenters = new Map();

  constructor({listElement, pointsModel}) {
    this.#listElement = listElement;
    this.#pointsModel = pointsModel;
    this.#pointsData = this.#pointsModel.tripPoints;
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

  #renderPoints(pointsData) {
    pointsData.forEach((pointData) => {
      this.#renderPoint(pointData);
    });
  }

  #renderPoint(pointData) {
    const pointPresenter = new PointPresenter({
      listElement: this.#listElement,
      handleDataChange: this.#handlePointChange,
      handlePointEditClick: this.#closeAllEditForms
    });

    pointPresenter.init(pointData, this.#pointTypes, this.#cities);
    this.#pointPresenters.set(pointData.id, pointPresenter);
  }

  #handlePointChange = (changedPoint) => {
    this.#pointsData = updateDataItem(this.#pointsData, changedPoint);
    this.#pointPresenters.get(changedPoint.id).init(changedPoint, this.#pointTypes, this.#cities);
  };

  #closeAllEditForms = () => {
    this.#pointPresenters.forEach((point) => {
      point.resetEditForm();
    });
  };
}
