import {
  EVT_KEYDOWN,
  KEY_ESCAPE, MODE
} from '../constants.js';
import {
  remove,
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
  #handleDataChange = null;
  #handleEditClick = null;
  #handleDeleteClick = null;
  #defaultMode = MODE.VIEW;
  #mode = this.#defaultMode;

  constructor({listElement, handleDataChange, handlePointEditClick, handleDeleteClick}) {
    this.#listElement = listElement;
    this.#handleDataChange = handleDataChange;
    this.#handleEditClick = handlePointEditClick;
    this.#handleDeleteClick = handleDeleteClick;
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
      onFormSubmit: this.#handleEditFormSubmit,
      onRollupButtonClick: () => {
        this.#replaceFormToPoint();
        document.removeEventListener(EVT_KEYDOWN, this.#escKeyDownHandler);
      },
      onDeleteClick: this.#handleDeleteClick
    });
    this.#pointData = pointData;

    if (prevPointComponent === null || prevEditFormComponent === null) {
      render(this.#pointComponent, this.#listElement);
      return;
    }

    if (this.#mode === this.#defaultMode) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === MODE.EDIT) {
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
    if (this.#mode === MODE.EDIT) {
      this.#replaceFormToPoint();
      document.removeEventListener(EVT_KEYDOWN, this.#escKeyDownHandler);
    }
  }

  #replacePointToForm() {
    replace(this.#editFormComponent, this.#pointComponent);
    this.#mode = MODE.EDIT;
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

  #handleEditFormSubmit = () => {
    const changedData = {...this.#editFormComponent.parseStateToPointData()};

    this.#handleDataChange(changedData);
    this.#replaceFormToPoint();
    document.removeEventListener(EVT_KEYDOWN, this.#escKeyDownHandler);
  };
}

