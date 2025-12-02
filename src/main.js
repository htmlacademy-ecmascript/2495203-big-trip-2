import {render, RenderPosition} from './framework/render.js';
import TripMainInfoView from './view/trip-main-info.js';
import FilterView from './view/filter-view.js';
import TripPointAddingButtonView from './view/trip-point-adding-button-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';

const tripMainElement = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const tripPresenter = new TripPresenter({
  tripContainer: eventsContainer,
  pointsModel: pointsModel
});

render(new TripMainInfoView(), tripMainElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), filterContainer);
render(new TripPointAddingButtonView(), tripMainElement);

tripPresenter.init();
