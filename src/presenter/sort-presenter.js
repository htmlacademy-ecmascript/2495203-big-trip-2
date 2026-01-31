import SortView from '../view/sort-view.js';
import {render} from '../framework/render.js';

export default class SortPresenter {
  #tripContainer;
  #handleSortChange;
  #sortView;
  #pointsModel;

  constructor({tripContainer, handleSortChange, pointsModel}) {
    this.#tripContainer = tripContainer;
    this.#handleSortChange = handleSortChange;
    this.#sortView = new SortView({onSortChange: this.#handleSortChange});
    this.#pointsModel = pointsModel;

    this.#pointsModel.setFilterChangeSortObserver(this.#onModelFilterChange);
  }

  init() {
    render(this.#sortView, this.#tripContainer);
  }

  resetForm() {
    this.#sortView.resetForm();
  }

  #onModelFilterChange = () => {
    this.resetForm();
  };
}
