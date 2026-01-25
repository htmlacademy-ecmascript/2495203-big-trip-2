import SortView from '../view/sort-view.js';
import {render} from '../framework/render.js';

export default class SortPresenter {
  #tripContainer = null;
  #handleSortChange = null;
  #sortView = null;
  #pointsModel = null;

  constructor({tripContainer, handleSortChange, pointsModel}) {
    this.#tripContainer = tripContainer;
    this.#handleSortChange = handleSortChange;
    this.#sortView = new SortView({onSortChange: handleSortChange});
    this.#pointsModel = pointsModel;

    this.#pointsModel.setFilterChangeSortObserver(this.#onModelFilterChange);
  }

  init() {
    render(this.#sortView, this.#tripContainer);
  }

  #onModelFilterChange = () => {
    this.#sortView.resetForm();
  };
}
