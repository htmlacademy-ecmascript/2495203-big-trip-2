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

  constructor({tripContainer, pointsModel}) {
    this.#pointsModel = pointsModel;
    this.#tripContainer = tripContainer;
    this.#pointsCount = this.#pointsModel.pointsCount;
    if (!this.#pointsCount) {
      this.#messageComponent = new MessageView();
      return;
    }
    this.#sortComponent = new SortView();
    this.#pointsListComponent = new TripPointsListView();
    this.#pointsListPresenter = new TripPointsListPresenter({
      listElement: this.#pointsListComponent.element,
      pointsModel: this.#pointsModel,
    });
  }

  init() {
    if (!this.#pointsCount) {
      this.#renderMessage();
      return;
    }
    this.#renderPointsList();
  }

  #renderPointsList() {
    render(this.#sortComponent, this.#tripContainer);
    render(this.#pointsListComponent, this.#tripContainer);
    this.#pointsListPresenter.init();
  }

  #renderMessage() {
    render(this.#messageComponent, this.#tripContainer);
  }
}
