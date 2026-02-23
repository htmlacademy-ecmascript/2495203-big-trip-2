import AbstractView from '../framework/view/abstract-view.js';

function createAddEventButtonTemplate() {
  return '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" disabled>New event</button>';
}

export default class TripPointAddingButtonView extends AbstractView {
  #clickHandler;

  constructor({onButtonClick}) {
    super();
    this.#clickHandler = onButtonClick;

    this.element.addEventListener('click', this.#handleButtonClick);
  }

  get template() {
    return createAddEventButtonTemplate();
  }

  #handleButtonClick = (evt) => {
    evt.preventDefault();
    this.element.disabled = true;
    this.#clickHandler();
  };
}
