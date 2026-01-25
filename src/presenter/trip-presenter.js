import {render} from '../framework/render.js';
import TripPointsListView from '../view/trip-points-list-view.js';
import TripPointsListPresenter from './trip-points-list-presenter.js';
import MessageView from '../view/message-view.js';
import SortPresenter from './sort-presenter.js';

export default class TripPresenter {
  #mainInfoContainer = null;
  #tripContainer = null;
  #pointsModel = null;
  #sortPresenter = null;
  #pointsListComponent = null;
  #pointsListPresenter = null;
  #messageComponent = null;
  #addButtonComponent = null;

  constructor({mainInfoContainer, tripContainer, pointsModel}) {
    this.#pointsModel = pointsModel;
    this.#mainInfoContainer = mainInfoContainer;
    this.#tripContainer = tripContainer;
    this.#pointsListComponent = new TripPointsListView();
    this.#pointsListPresenter = new TripPointsListPresenter({
      listElement: this.#pointsListComponent.element,
      pointsModel: this.#pointsModel,
    });
    this.#sortPresenter = new SortPresenter({
      tripContainer: this.#tripContainer,
      handleSortChange: this.#pointsListPresenter.handleSortChange,
      pointsModel: this.#pointsModel
    });
    this.#messageComponent = new MessageView();

    this.#pointsModel.setPointAddObserver(this.#handleModelPointAdd);
  }

  init({addButtonView}) {
    this.#addButtonComponent = addButtonView;
    if (!this.#pointsModel.pointsCount) {
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
    this.#sortPresenter.init();
    render(this.#pointsListComponent, this.#tripContainer);
  }

  #renderMessage() {
    render(this.#messageComponent, this.#tripContainer);
  }

  #removeMessage() {
    this.#messageComponent.removeElement();
  }

  #handleModelPointAdd = () => {
    this.#pointsListPresenter.clearPointsList();
    this.init({addButtonView: this.#addButtonComponent});
  };
}
