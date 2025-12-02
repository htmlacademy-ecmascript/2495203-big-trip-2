import {
  render,
  replace
} from '../framework/render.js';
import TripPointAddingFormView from '../view/trip-point-adding-form-view.js';
import TripPointView from '../view/trip-point-view.js';
import TripPointEditingFormView from '../view/trip-point-editing-form-view.js';

export default class TripPointsListPresenter {
  #listElement = null;
  #pointsModel = null;
  #pointsData = null;
  #pointTypes = null;
  #cities = null;
  #addingFormComponent = null;

  constructor({listElement, pointsModel}) {
    this.#listElement = listElement;
    this.#pointsModel = pointsModel;
    this.#pointsData = this.#pointsModel.tripPoints;
    this.#pointTypes = this.#pointsModel.pointTypes;
    this.#cities = this.#pointsModel.cities;
    this.#addingFormComponent = new TripPointAddingFormView({
      cities: this.#pointsModel.cities,
      pointTypes: this.#pointsModel.pointTypes,
      blankPoint: this.#pointsModel.blankPoint,
    });
  }

  init() {
    //render(this.#addingFormComponent, this.#listElement);
    this.#renderPoints(this.#pointsData);
  }


  #renderPoints(pointsData) {
    pointsData.forEach((pointData) => {
      this.#renderPoint(pointData);
    });
  }

  #renderPoint(pointData) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new TripPointView({
      pointData,
      pointTypes: this.#pointTypes,
      cities: this.#cities,
      onEditClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const editFormComponent = new TripPointEditingFormView({
      pointData,
      pointTypes: this.#pointTypes,
      cities: this.#cities,
      onFormSubmit: replaceFormToPoint,
      onRollupButtonClick: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointToForm() {
      replace(editFormComponent, pointComponent);
    }

    function replaceFormToPoint() {
      replace(pointComponent, editFormComponent);
    }

    render(pointComponent, this.#listElement);
  }
}
