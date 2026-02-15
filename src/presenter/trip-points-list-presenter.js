import {
  remove,
  render,
  RenderPosition,
} from '../framework/render.js';
import TripPointAddingFormView from '../view/trip-point-adding-form-view.js';
import PointPresenter from './point-presenter.js';
import {
  sortByDateAsc,
  sortByDurationAsc,
  sortByPriceAsc
} from '../utils.js';
import {SORT_CRITERIA} from '../constants.js';
import MessageView from '../view/message-view';

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
  #resetSortForm;

  constructor({listElement, pointsModel, tripContainer, resetSortForm}) {
    this.#listElement = listElement;
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#pointTypes = this.#pointsModel.pointTypes;
    this.#cities = this.#pointsModel.cities;
    this.#resetSortForm = resetSortForm;

    this.#pointsModel.setPointEditObserver(this.#handleModelPointChange);
    this.#pointsModel.setPointRemoveObserver(this.#handleModelPointRemove);
    this.#pointsModel.setFilterChangeListObserver(this.#handleModelFilterChange);
  }

  get points() {
    switch (this.#currentSortCriteria) {
      case SORT_CRITERIA.DURATION: {
        return [...this.#pointsModel.tripPoints.sort(sortByDurationAsc)];
      }
      case SORT_CRITERIA.PRICE: {
        return [...this.#pointsModel.tripPoints.sort(sortByPriceAsc)];
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
      addButtonView: this.#addButtonComponent
    });
    this.#resetAllForms();
    this.handleSortChange(SORT_CRITERIA.START_DAY);
    this.#resetSortForm();
    render(this.#addingFormComponent, this.#listElement, RenderPosition.AFTERBEGIN);
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

  removeMessage() {
    if (this.#noPointsMessageView) {
      remove(this.#noPointsMessageView);
      this.#noPointsMessageView = null;
    }
  }

  #enableButton() {
    this.#addButtonComponent.element.disabled = false;
  }

  #renderPoints(pointsData) {
    if (pointsData.length) {
      pointsData.forEach((pointData) => {
        this.#renderPoint(pointData);
      });
      return;
    }

    this.#renderMessage(this.#pointsModel.currentFilter);
  }

  #renderPoint(pointData) {
    const pointPresenter = new PointPresenter({
      listElement: this.#listElement,
      handleDataChange: this.#handlePointChange,
      handlePointEditClick: this.#resetAllForms,
      handleDeleteClick: this.#handleDeleteClick,
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

  #handlePointChange = async (changedPoint) => {
    try {
      await this.#pointsModel.updatePoint(changedPoint);
    } catch (error) {
      this.#pointPresenters.get(changedPoint.id).setPointUpdateAborting();
    }
  };

  #handleAddFormSubmit = (pointData) => {
    this.#pointsModel.addPoint(pointData);
    this.#enableButton();
  };

  #handleDeleteClick = (pointId) => {
    this.#pointsModel.removePoint(pointId);
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
}
