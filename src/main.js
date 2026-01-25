import {render} from './framework/render.js';
import TripMainInfoView from './view/trip-main-info.js';
import TripPointAddingButtonView from './view/trip-point-adding-button-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';
import FilterPresenter from './presenter/filter-presenter.js';

const mainInfoContainer = document.querySelector('.trip-main');
const eventsContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const tripPresenter = new TripPresenter({
  mainInfoContainer: mainInfoContainer,
  tripContainer: eventsContainer,
  pointsModel: pointsModel
});
const filterPresenter = new FilterPresenter({
  pointsModel: pointsModel,
  mainInfoContainer: mainInfoContainer
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

  filterPresenter.init();
}
render(addButtonView, mainInfoContainer);

tripPresenter.init({addButtonView});
