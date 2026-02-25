import AbstractView from '../framework/view/abstract-view.js';
import he from 'he';

function getMessageTemplate(message) {
  return (
    `<p class="trip-events__msg">${he.encode(message)}</p>`
  );
}

export default class MessageView extends AbstractView {
  #message;

  constructor({message}) {
    super();
    this.#message = message;
  }

  get template() {
    return getMessageTemplate(this.#message);
  }
}
