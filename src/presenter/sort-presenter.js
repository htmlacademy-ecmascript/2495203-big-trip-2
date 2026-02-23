import SortView from '../view/sort-view.js';
import {remove, render, RenderPosition} from '../framework/render.js';

export default class SortPresenter {
  #tripContainer;
  #handleSortChange;
  #sortView;
  #pointsModel;
  #isRendered = false;

  constructor({tripContainer, handleSortChange, pointsModel}) {
    this.#tripContainer = tripContainer;
    this.#handleSortChange = handleSortChange;
    this.#sortView = new SortView({
      onSortChange: this.#handleSortChange
    });
    this.#pointsModel = pointsModel;

    this.#pointsModel.setFilterChangeSortObserver(this.#onModelFilterChange);
  }

  init() {
    if (!this.#isRendered) {

      if (!this.#sortView) {
        this.#sortView = new SortView({
          onSortChange: this.#handleSortChange
        });
      }

      render(this.#sortView, this.#tripContainer, RenderPosition.AFTERBEGIN);
      this.#isRendered = true;
    }
  }

  resetForm() {
    this.#sortView.resetForm();
  }

  removeSortForm() {
    if (this.#sortView) {
      remove(this.#sortView);
      this.#sortView = null;
      this.#isRendered = false;
    }
  }

  #onModelFilterChange = () => {
    this.resetForm();
  };
}
