import {remove, render} from './framework/render.js';
import TripPointAddingButtonView from './view/trip-point-adding-button-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripApiService from './trip-api-service';
import {AUTHORIZATION, LOADING_MESSAGE, SERVER_PATH} from './constants';
import MainInfoPresenter from './presenter/main-info-presenter.js';
import MessageView from './view/message-view.js';

const mainInfoContainer = document.querySelector('.trip-main');
const eventsContainer = document.querySelector('.trip-events');

const apiService = new TripApiService(
  SERVER_PATH,
  AUTHORIZATION
);

const pointsModel = new PointsModel({tripApiService: apiService});

const loadingMessage = new MessageView({message: LOADING_MESSAGE.PROCESS});
render(loadingMessage, eventsContainer);

pointsModel.init()
  .then(() => {
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
    const mainInfoPresenter = new MainInfoPresenter({
      model: pointsModel,
      mainInfoContainer: mainInfoContainer
    });

    remove(loadingMessage);
    if (pointsModel.pointsCount) {
      mainInfoPresenter.init();
    }
    filterPresenter.init();
    render(addButtonView, mainInfoContainer);

    tripPresenter.init({addButtonView});
  })
  .catch(() => {
    const errorMessage = new MessageView({message: LOADING_MESSAGE.ERROR});
    render(errorMessage, eventsContainer);
  });
