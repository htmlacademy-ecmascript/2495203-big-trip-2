import {render} from '../framework/render.js';
import TripPointsListView from '../view/trip-points-list-view.js';
import TripPointsListPresenter from './trip-points-list-presenter.js';
import SortPresenter from './sort-presenter.js';

export default class TripPresenter {
  #mainInfoContainer;
  #tripContainer;
  #pointsModel;
  #sortPresenter;
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
      resetSortForm: this.#resetSortForm
    });
    this.#sortPresenter = new SortPresenter({
      tripContainer: this.#tripContainer,
      handleSortChange: this.#pointsListPresenter.handleSortChange,
      pointsModel: this.#pointsModel
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
    this.#sortPresenter.init();
    render(this.#pointsListComponent, this.#tripContainer);
  }

  #resetSortForm = () => {
    if (this.#sortPresenter) {
      this.#sortPresenter.resetForm();
    }
  };

  #handleModelPointAdd = () => {
    this.#pointsListPresenter.unblockInterface();
    this.#pointsListPresenter.clearPointsList();
    this.init({addButtonView: this.#addButtonComponent});
  };
}
