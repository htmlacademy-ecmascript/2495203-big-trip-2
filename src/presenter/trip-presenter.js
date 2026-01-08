import {render} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripPointsListView from '../view/trip-points-list-view.js';
import TripPointsListPresenter from './trip-points-list-presenter.js';
import MessageView from '../view/message-view.js';

export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #sortComponent = null;
  #pointsListComponent = null;
  #pointsListPresenter = null;
  #pointsCount = null;
  #messageComponent = null;
  #addButtonComponent = null;

  constructor({tripContainer, pointsModel}) {
    this.#pointsModel = pointsModel;
    this.#tripContainer = tripContainer;
    this.#pointsCount = this.#pointsModel.pointsCount;
    this.#pointsListComponent = new TripPointsListView();
    this.#pointsListPresenter = new TripPointsListPresenter({
      listElement: this.#pointsListComponent.element,
      pointsModel: this.#pointsModel,
    });
    this.#sortComponent = new SortView({
      onSortChange: this.#pointsListPresenter.handleSortChange
    });
    this.#messageComponent = new MessageView();
  }

  init({addButtonView}) {
    this.#addButtonComponent = addButtonView;
    if (!this.#pointsCount) {
      this.#renderMessage();
      return;
    }
    this.#renderPointsList();
  }

  handleAddingButtonClick() {
    this.#removeMessage();
    this.#createListLayout();
    this.#pointsListPresenter.openAddingForm();
  }

  #renderPointsList() {
    this.#createListLayout();
    this.#pointsListPresenter.init({addButtonView: this.#addButtonComponent});
  }

  #createListLayout() {
    render(this.#sortComponent, this.#tripContainer);
    render(this.#pointsListComponent, this.#tripContainer);
  }

  #renderMessage() {
    render(this.#messageComponent, this.#tripContainer);
  }

  #removeMessage() {
    this.#messageComponent.removeElement();
  }
}
