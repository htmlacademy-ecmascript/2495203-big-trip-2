import {render} from '../render.js';
import SortView from '../view/sort-view.js';
import TripPointsListView from '../view/trip-points-list-view.js';
import TripPointsListPresenter from './trip-points-list-presenter.js';

export default class TripPresenter {
  constructor({tripContainer, pointsModel}) {
    this.tripContainer = tripContainer;
    this.pointsModel = pointsModel;
    this.sortComponent = new SortView();
    this.tripPointsListComponent = new TripPointsListView();
    this.tripPointsListPresenter = new TripPointsListPresenter({
      listElement: this.tripPointsListComponent.getElement(),
      pointsModel: this.pointsModel
    });
  }

  init() {
    render(this.sortComponent, this.tripContainer);
    render(this.tripPointsListComponent, this.tripContainer);
    this.tripPointsListPresenter.init();
  }
}
