import FilterView from '../view/filter-view.js';
import {render} from '../framework/render.js';

export default class FilterPresenter {
  #pointsModel = null;
  #mainInfoContainer = null;
  #filterView = null;

  constructor({pointsModel, mainInfoContainer}) {
    this.#pointsModel = pointsModel;
    this.#mainInfoContainer = mainInfoContainer;
    this.#filterView = new FilterView({
      filterChangeHandler: this.#handleFilterChange
    });
  }

  init() {
    if (this.#filterView !== null) {
      render(this.#filterView, this.#mainInfoContainer);
    }
  }

  #handleFilterChange = (buttonValue) => {
    this.#pointsModel.changeFilter(buttonValue);
  };
}
