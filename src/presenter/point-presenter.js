import {
  EVT_KEYDOWN,
  KEY_ESCAPE
} from '../constants.js';
import {
  render,
  replace
} from '../framework/render.js';
import TripPointView from '../view/trip-point-view.js';
import TripPointEditingFormView from '../view/trip-point-editing-form-view.js';

export default class PointPresenter {
  #pointComponent = null;
  #editFormComponent = null;
  #listElement = null;
  #pointData = null;

  constructor(listElement) {
    this.#listElement = listElement;
  }

  init(pointData, pointTypes, cities) {
    this.#pointData = pointData;
    this.#pointComponent = new TripPointView({
      pointData,
      pointTypes,
      cities,
      onEditClick: () => {
        this.#replacePointToForm();
        document.addEventListener(EVT_KEYDOWN, this.#escKeyDownHandler);
      }
    });
    this.#editFormComponent = new TripPointEditingFormView({
      pointData,
      pointTypes,
      cities,
      onFormSubmit: () => {
        this.#replaceFormToPoint();
        document.removeEventListener(EVT_KEYDOWN, this.#escKeyDownHandler);
      },
      onRollupButtonClick: () => {
        this.#replaceFormToPoint();
        document.removeEventListener(EVT_KEYDOWN, this.#escKeyDownHandler);
      }
    });

    render(this.#pointComponent, this.#listElement);
  }

  #replacePointToForm() {
    replace(this.#editFormComponent, this.#pointComponent);
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editFormComponent);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === KEY_ESCAPE) {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener(EVT_KEYDOWN, this.#escKeyDownHandler);
    }
  };
}

