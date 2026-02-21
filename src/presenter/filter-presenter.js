import FilterView from '../view/filter-view.js';
import {render} from '../framework/render.js';

export default class FilterPresenter {
  #pointsModel;
  #mainInfoContainer;
  #filterView;

  constructor({pointsModel, mainInfoContainer}) {
    this.#pointsModel = pointsModel;
    this.#mainInfoContainer = mainInfoContainer;
    this.#filterView = new FilterView({
      filterChangeHandler: this.#handleFilterChange,
      filterStatus: this.#pointsModel.filterStatus
    });
    this.#pointsModel.setPointsUpdateFilterObserver(this.#handleModelFilterStatusChange);
  }

  init() {
    if (this.#filterView) {
      render(this.#filterView, this.#mainInfoContainer);
    }
  }

  #handleFilterChange = (buttonValue) => {
    this.#pointsModel.changeFilter(buttonValue);
  };

  #handleModelFilterStatusChange = (filterStatus) => {
    this.#filterView.updateElement(filterStatus);
  };
}
