import {
  EVT_KEYDOWN,
  KEY_ESCAPE
} from '../constants.js';
import {
  remove,
  render,
  replace
} from '../framework/render.js';
import TripPointView from '../view/trip-point-view.js';
import TripPointEditingFormView from '../view/trip-point-editing-form-view.js';

const Mode = {
  VIEW: 'VIEW',
  EDIT: 'EDIT'
};
export default class PointPresenter {
  #pointComponent = null;
  #editFormComponent = null;
  #listElement = null;
  #pointData = null;
  #handleDataChange = null;
  #handleEditClick = null;
  #defaultMode = Mode.VIEW;
  #mode = this.#defaultMode;

  constructor({listElement, handleDataChange, handlePointEditClick}) {
    this.#listElement = listElement;
    this.#handleDataChange = handleDataChange;
    this.#handleEditClick = handlePointEditClick;
  }

  init(pointData, pointTypes, cities) {
    const prevPointComponent = this.#pointComponent;
    const prevEditFormComponent = this.#editFormComponent;

    this.#pointComponent = new TripPointView({
      pointData,
      pointTypes,
      cities,
      onEditClick: () => {
        this.#handleEditClick();
        this.#replacePointToForm();
        document.addEventListener(EVT_KEYDOWN, this.#escKeyDownHandler);
      },
      onFavoriteClick: () => {
        this.#handleFavoriteClick();
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
    this.#pointData = pointData;

    if (prevPointComponent === null || prevEditFormComponent === null) {
      render(this.#pointComponent, this.#listElement);
      return;
    }

    if (this.#mode === this.#defaultMode) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDIT) {
      replace(this.#editFormComponent, prevEditFormComponent);
    }

    remove(prevPointComponent);
    remove(prevEditFormComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editFormComponent);
  }

  resetForm() {
    if (this.#mode === Mode.EDIT) {
      this.#replaceFormToPoint();
      document.removeEventListener(EVT_KEYDOWN, this.#escKeyDownHandler);
    }
  }

  #replacePointToForm() {
    replace(this.#editFormComponent, this.#pointComponent);
    this.#mode = Mode.EDIT;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editFormComponent);
    this.#mode = this.#defaultMode;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === KEY_ESCAPE) {
      evt.preventDefault();
      this.#replaceFormToPoint();
      document.removeEventListener(EVT_KEYDOWN, this.#escKeyDownHandler);
    }
  };

  #handleFavoriteClick = () => {
    const changedData = {
      ...this.#pointData,
      isFavorite: !this.#pointData.isFavorite
    };
    this.#handleDataChange(changedData);
  };
}

