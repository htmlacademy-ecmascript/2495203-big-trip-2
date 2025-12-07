import AbstractView from '../framework/view/abstract-view.js';

function getOffersTemplate(offers) {
  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offers.map(({name, alias, price}) => `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${alias}-1" type="checkbox" name="event-offer-${alias}" checked>
            <label class="event__offer-label" for="event-offer-${alias}-1">
              <span class="event__offer-title">${name}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${price}</span>
            </label>
          </div>
        `).join('')}
      </div>
    </section>`
  );
}

function getCitiesSuggestions(cities) {
  return (
    `<datalist id="destination-list-1">
      ${cities.map(({cityName}) => `
        <option value="${cityName}"></option>
      `).join('')}
    </datalist>`
  );
}

function getTypesTemplate(types) {
  return (
    `<div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>

          ${types.map(({name, capitalizedName}) => `
            <div class="event__type-item">
              <input id="event-type-${name}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${name}">
              <label class="event__type-label  event__type-label--${name}" for="event-type-${name}-1">${capitalizedName}</label>
            </div>
          `).join('')}
        </fieldset>
      </div>`
  );
}

function getEditTripPointFormTemplate(pointData, types, cities) {
  return (
    `<li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label class="event__type  event__type-btn" for="event-type-toggle-1">
                <span class="visually-hidden">Choose event type</span>
                <img class="event__type-icon" width="17" height="17" src="img/icons/${pointData.type.name}.png" alt="Event type icon">
              </label>
              <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

              ${getTypesTemplate(types)}
            </div>

            <div class="event__field-group  event__field-group--destination">
              <label class="event__label  event__type-output" for="event-destination-1">
                ${pointData.type.name}
              </label>
              <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${pointData.destination.cityName}" list="destination-list-1">
              ${getCitiesSuggestions(cities)}
            </div>

            <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="event-start-time-1">From</label>
              <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${pointData.formStartDate}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">To</label>
              <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${pointData.formEndDate}">
            </div>

            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${pointData.price}">
            </div>

            <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">Delete</button>
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
          </header>
          <section class="event__details">
            ${getOffersTemplate(pointData.type.options)}

            <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${pointData.destination.description}</p>
            </section>
          </section>
        </form>
      </li>`
  );
}

export default class TripPointEditingFormView extends AbstractView {
  #pointData = null;
  #pointTypes = null;
  #cities = null;
  #form = null;
  #rollupButton = null;
  #handleFormSubmit = null;
  #handleRollupButtonClick = null;

  constructor({pointData, pointTypes, cities, onFormSubmit, onRollupButtonClick}) {
    super();
    this.#pointData = pointData;
    this.#pointTypes = pointTypes;
    this.#cities = cities;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupButtonClick = onRollupButtonClick;

    this.#form = this.element.querySelector('form');
    this.#rollupButton = this.element.querySelector('.event__rollup-btn');

    this.#form.addEventListener('submit', this.#formSubmitHandler);
    this.#rollupButton.addEventListener('click', this.#rollupButtonClickHandler);
  }

  get template() {
    return getEditTripPointFormTemplate(this.#pointData, this.#pointTypes, this.#cities);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #rollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupButtonClick();
  };
}
