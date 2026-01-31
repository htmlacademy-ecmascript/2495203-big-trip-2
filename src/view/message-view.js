import AbstractView from '../framework/view/abstract-view.js';
import {NO_POINTS_MESSAGE} from '../constants';

function getMessageTemplate(filter) {
  return (
    `<p class="trip-events__msg">${NO_POINTS_MESSAGE[filter.toUpperCase()]}</p>`
  );
}

export default class MessageView extends AbstractView {
  #currentFilter = null;

  constructor({currentFilter}) {
    super();
    this.#currentFilter = currentFilter;
  }

  get template() {
    return getMessageTemplate(this.#currentFilter);
  }
}
