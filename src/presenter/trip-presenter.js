import {render} from '../framework/render.js';
import SortView from '../view/sort-view.js';
import TripPointsListView from '../view/trip-points-list-view.js';
import TripPointsListPresenter from './trip-points-list-presenter.js';

export default class TripPresenter {
  #tripContainer = null;
  #pointsModel = null;
  #sortComponent = null;
  #pointsListComponent = null;
  #pointsListPresenter = null;

  constructor({tripContainer, pointsModel}) {
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#sortComponent = new SortView();
    this.#pointsListComponent = new TripPointsListView();
    this.#pointsListPresenter = new TripPointsListPresenter({
      listElement: this.#pointsListComponent.element,
      pointsModel: this.#pointsModel,
    });
  }

  init() {
    render(this.#sortComponent, this.#tripContainer);
    render(this.#pointsListComponent, this.#tripContainer);
    this.#pointsListPresenter.init();
  }
}
