import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {FILTER} from '../constants.js';

function createFilterTemplate(state) {
  return (
    `<div class="trip-main__trip-controls  trip-controls">
      <div class="trip-controls__filters">
        <h2 class="visually-hidden">Filter events</h2>
        <form class="trip-filters" action="#" method="get">
          <div class="trip-filters__filter">
            <input id="filter-everything"
              class="trip-filters__filter-input  visually-hidden"
              type="radio"
              name="trip-filter"
              value="everything"
              checked
              ${state[FILTER.EVERYTHING] ? '' : 'disabled'}
              >
            <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
          </div>

          <div class="trip-filters__filter">
            <input id="filter-future"
              class="trip-filters__filter-input  visually-hidden"
              type="radio"
              name="trip-filter"
              value="future"
              ${state[FILTER.FUTURE] ? '' : 'disabled'}
              >
            <label class="trip-filters__filter-label" for="filter-future">Future</label>
          </div>

          <div class="trip-filters__filter">
            <input id="filter-present"
              class="trip-filters__filter-input  visually-hidden"
              type="radio"
              name="trip-filter"
              value="present"
              ${state[FILTER.PRESENT] ? '' : 'disabled'}
              >
            <label class="trip-filters__filter-label" for="filter-present">Present</label>
          </div>

          <div class="trip-filters__filter">
            <input id="filter-past"
              class="trip-filters__filter-input  visually-hidden"
              type="radio"
              name="trip-filter"
              value="past"
              ${state[FILTER.PAST] ? '' : 'disabled'}
              >
            <label class="trip-filters__filter-label" for="filter-past">Past</label>
          </div>

          <button class="visually-hidden" type="submit">Accept filter</button>
        </form>
      </div>
    </div>`
  );
}

export default class FilterView extends AbstractStatefulView {
  #form;
  #onFilterChange;

  constructor({filterChangeHandler, filterStatus}) {
    super();
    this.#onFilterChange = filterChangeHandler;

    this._setState(filterStatus);
    this.#setHandlers();
  }

  get template() {
    return createFilterTemplate(this._state);
  }

  _restoreHandlers() {
    this.#setHandlers();
  }

  #setHandlers = () => {
    this.#form = this.element.querySelector('form');

    this.#form.addEventListener('change', (evt) => {
      this.#handleFilterButtonClick(evt);
    });
  };

  #handleFilterButtonClick = (evt) => {
    const chosenFilter = evt.target.value;

    this.#onFilterChange(chosenFilter);
  };
}
