import {
  remove,
  render,
  RenderPosition,
} from '../framework/render.js';
import TripPointAddingFormView from '../view/trip-point-adding-form-view.js';
import PointPresenter from './point-presenter.js';
import {
  sortByDateAsc,
  sortByDurationDesc,
  sortByPriceDesc
} from '../utils.js';
import {EVT_KEYDOWN, KEY_ESCAPE, SORT_CRITERIA} from '../constants.js';
import MessageView from '../view/message-view';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import SortPresenter from './sort-presenter.js';

export default class TripPointsListPresenter {
  #listElement;
  #tripContainer;
  #pointsModel;
  #pointTypes;
  #cities;
  #addButtonComponent;
  #addingFormComponent;
  #pointPresenters = new Map();
  #currentSortCriteria = SORT_CRITERIA.START_DAY;
  #noPointsMessageView;
  #interfaceBlocker;
  #sortPresenter;

  constructor({listElement, pointsModel, tripContainer}) {
    this.#listElement = listElement;
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#pointTypes = this.#pointsModel.pointTypes;
    this.#cities = this.#pointsModel.cities;
    this.#interfaceBlocker = new UiBlocker({
      lowerLimit: 0,
      upperLimit: 0
    });
    this.#sortPresenter = new SortPresenter({
      tripContainer: this.#tripContainer,
      handleSortChange: this.handleSortChange,
      pointsModel: this.#pointsModel
    });


    this.#pointsModel.setPointEditObserver(this.#handleModelPointChange);
    this.#pointsModel.setPointRemoveObserver(this.#handleModelPointRemove);
    this.#pointsModel.setFilterChangeListObserver(this.#handleModelFilterChange);
  }

  get points() {
    switch (this.#currentSortCriteria) {
      case SORT_CRITERIA.DURATION: {
        return [...this.#pointsModel.tripPoints.sort(sortByDurationDesc)];
      }
      case SORT_CRITERIA.PRICE: {
        return [...this.#pointsModel.tripPoints.sort(sortByPriceDesc)];
      }
      case SORT_CRITERIA.START_DAY: {
        return [...this.#pointsModel.tripPoints.sort(sortByDateAsc)];
      }
    }

    return [...this.#pointsModel.tripPoints];
  }

  init({addButtonView}) {
    this.#addButtonComponent = addButtonView;
    this.#renderPoints(this.points);
  }

  openAddingForm() {
    this.#addingFormComponent = new TripPointAddingFormView({
      cities: this.#pointsModel.cities,
      pointTypes: this.#pointsModel.pointTypes,
      blankPoint: this.#pointsModel.blankPoint,
      onFormSubmit: this.#handleAddFormSubmit,
      onCancelButtonClick: this.#handleCancelButtonClick
    });
    this.#resetAllForms();
    this.handleSortChange(SORT_CRITERIA.START_DAY);
    this.#sortPresenter.resetForm();
    render(this.#addingFormComponent, this.#listElement, RenderPosition.AFTERBEGIN);
    document.addEventListener(EVT_KEYDOWN, this.#escKeyDownHandler);
  }

  handleSortChange = (sortCriteria) => {
    if (sortCriteria === this.#currentSortCriteria) {
      return;
    }

    this.#currentSortCriteria = sortCriteria;
    this.#rerenderPoints();
  };

  clearPointsList = () => {
    this.#pointPresenters.forEach((point) => {
      point.destroy();
    });
    this.#pointPresenters.clear();
    this.removeMessage();
  };

  blockInterface() {
    this.#interfaceBlocker.block();
  }

  unblockInterface() {
    this.#interfaceBlocker.unblock();
  }

  removeMessage() {
    if (this.#noPointsMessageView) {
      remove(this.#noPointsMessageView);
      this.#noPointsMessageView = null;
    }
  }

  #closeAddingForm() {
    if (this.#addingFormComponent) {
      remove(this.#addingFormComponent);
      this.#enableButton();
      document.removeEventListener(EVT_KEYDOWN, this.#escKeyDownHandler);
    }
  }

  #enableButton() {
    this.#addButtonComponent.element.disabled = false;
  }

  #renderPoints(pointsData) {
    if (pointsData.length) {
      this.#sortPresenter.init();

      pointsData.forEach((pointData) => {
        this.#renderPoint(pointData);
      });
      return;
    }

    this.#sortPresenter.removeSortForm();
    this.#renderMessage(this.#pointsModel.currentFilter);
  }

  #renderPoint(pointData) {
    const pointPresenter = new PointPresenter({
      listElement: this.#listElement,
      handleDataChange: this.#handlePointChange,
      handlePointEditClick: this.#resetAllForms,
      handleDeleteClick: this.#handleDeleteClick,
      interfaceBlocker: this.#interfaceBlocker
    });

    pointPresenter.init(pointData, this.#pointTypes, this.#cities);
    this.#pointPresenters.set(pointData.id, pointPresenter);
  }

  #resetAllForms = () => {
    this.#pointPresenters.forEach((point) => {
      point.resetForm();
    });
  };

  #rerenderPoints = () => {
    this.clearPointsList();
    this.#renderPoints(this.points);
  };

  #renderMessage(filter) {
    this.#noPointsMessageView = new MessageView({currentFilter: filter});
    render(this.#noPointsMessageView, this.#tripContainer);
  }

  #setAddFormSaving = () => {
    this.blockInterface();
    if (this.#addingFormComponent) {
      this.#addingFormComponent.updateElement({
        isSaving: true,
        isDisabled: true
      });
    }
  };

  #setAddFormAborting = () => {
    this.unblockInterface();
    if (this.#addingFormComponent) {
      this.#addingFormComponent.updateElement({
        isSaving: false,
        isDisabled: false
      });
      this.#addingFormComponent.shake();
    }
  };

  #handlePointChange = async (changedPoint) => {
    try {
      this.blockInterface();
      await this.#pointsModel.updatePoint(changedPoint);
      this.unblockInterface();
    } catch (error) {
      this.#pointPresenters.get(changedPoint.id).setPointAborting();
    }
  };

  #handleAddFormSubmit = async (pointData) => {
    try {
      this.#setAddFormSaving();
      await this.#pointsModel.addPoint(pointData);

      this.#enableButton();
      remove(this.#addingFormComponent);
    } catch (error) {
      this.#setAddFormAborting();
    }
  };

  #handleDeleteClick = async (pointId) => {
    try {
      this.#pointPresenters.get(pointId).setPointDeleting();
      await this.#pointsModel.removePoint(pointId);

      this.unblockInterface();
    } catch (error) {
      this.#pointPresenters.get(pointId).setPointAborting();
    }
  };

  #handleModelPointChange = (changedPoint) => {
    this.#pointPresenters.get(changedPoint.id).init(changedPoint, this.#pointTypes, this.#cities);
    this.#pointPresenters.get(changedPoint.id).handleSuccessfullUpdate();
    this.#rerenderPoints();
  };

  #handleModelPointRemove = () => {
    this.#rerenderPoints();
  };

  #handleModelFilterChange = () => {
    this.#currentSortCriteria = SORT_CRITERIA.START_DAY;
    this.#rerenderPoints();
  };

  #handleCancelButtonClick = () => {
    this.#closeAddingForm();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === KEY_ESCAPE) {
      evt.preventDefault();
      this.#closeAddingForm();
      document.removeEventListener(EVT_KEYDOWN, this.#escKeyDownHandler);
    }
  };
}
