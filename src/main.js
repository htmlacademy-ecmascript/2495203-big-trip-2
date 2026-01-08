import {render} from './framework/render.js';
import TripMainInfoView from './view/trip-main-info.js';
import FilterView from './view/filter-view.js';
import TripPointAddingButtonView from './view/trip-point-adding-button-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';

const mainInfoContainer = document.querySelector('.trip-main');
const eventsContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const tripPresenter = new TripPresenter({
  tripContainer: eventsContainer,
  pointsModel: pointsModel
});
const addButtonView = new TripPointAddingButtonView({
  onButtonClick: () => {
    tripPresenter.handleAddingButtonClick();
  }
});

if (pointsModel.pointsCount) {
  render(new TripMainInfoView({
    mainInfo: pointsModel.mainInfo
  }), mainInfoContainer);
}
render(new FilterView(), mainInfoContainer);
render(addButtonView, mainInfoContainer);

tripPresenter.init({addButtonView});
