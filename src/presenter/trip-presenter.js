import {render} from '../framework/render.js';
import TripPointsListView from '../view/trip-points-list-view.js';
import TripPointsListPresenter from './trip-points-list-presenter.js';

export default class TripPresenter {
  #mainInfoContainer;
  #tripContainer;
  #pointsModel;
  #pointsListComponent;
  #pointsListPresenter;
  #addButtonComponent;

  constructor({mainInfoContainer, tripContainer, pointsModel}) {
    this.#pointsModel = pointsModel;
    this.#mainInfoContainer = mainInfoContainer;
    this.#tripContainer = tripContainer;
    this.#pointsListComponent = new TripPointsListView();
    this.#pointsListPresenter = new TripPointsListPresenter({
      listElement: this.#pointsListComponent.element,
      pointsModel: this.#pointsModel,
      tripContainer: this.#tripContainer,
    });

    this.#pointsModel.setPointAddObserver(this.#handleModelPointAdd);
  }

  init({addButtonView}) {
    this.#addButtonComponent = addButtonView;
    this.#renderPointsList();
  }

  handleAddingButtonClick() {
    this.#pointsListPresenter.removeMessage();
    this.#createListLayout();
    this.#pointsListPresenter.openAddingForm();
  }

  #renderPointsList() {
    this.#createListLayout();
    this.#pointsListPresenter.init({addButtonView: this.#addButtonComponent});
  }

  #createListLayout() {
    render(this.#pointsListComponent, this.#tripContainer);
  }

  #handleModelPointAdd = () => {
    this.#pointsListPresenter.unblockInterface();
    this.#pointsListPresenter.clearPointsList();
    this.init({addButtonView: this.#addButtonComponent});
  };
}
