import {
  render,
  replace
} from '../framework/render.js';
import TripPointAddingFormView from '../view/trip-point-adding-form-view.js';
import TripPointView from '../view/trip-point-view.js';
import TripPointEditingFormView from '../view/trip-point-editing-form-view.js';
import {
  EVT_KEYDOWN,
  KEY_ESCAPE
} from '../constants.js';

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
    this.#renderPoints(this.#pointsData);
  }


  #renderPoints(pointsData) {
    pointsData.forEach((pointData) => {
      this.#renderPoint(pointData);
    });
  }

  #renderPoint(pointData) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === KEY_ESCAPE) {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener(EVT_KEYDOWN, escKeyDownHandler);
      }
    };

    const pointComponent = new TripPointView({
      pointData,
      pointTypes: this.#pointTypes,
      cities: this.#cities,
      onEditClick: () => {
        replacePointToForm();
        document.addEventListener(EVT_KEYDOWN, escKeyDownHandler);
      }
    });

    const editFormComponent = new TripPointEditingFormView({
      pointData,
      pointTypes: this.#pointTypes,
      cities: this.#cities,
      onFormSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener(EVT_KEYDOWN, escKeyDownHandler);
      },
      onRollupButtonClick: () => {
        replaceFormToPoint();
        document.removeEventListener(EVT_KEYDOWN, escKeyDownHandler);
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
