import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {
  capitalizeFirstLetter,
  getTypeIconSrc
} from '../utils.js';

function getPointDetails(state) {
  if (!(state.type.options || state.destination.description)) {
    return;
  }

  return (
    `<section class="event__details">
        ${state.type.options ? getOffersTemplate(state.type.options) : ''}
        ${state.destination.description ? getDescriptionTemplate(state.destination.description) : ''}
    </section>`
  );
}

function getDescriptionTemplate(description) {
  return (
    `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
    </section>`
  );
}

function getOffersTemplate(offers) {
  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offers.map(({id, name, alias, price}) => `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${alias}" type="checkbox" name="event-offer-${alias}" value="${id}">
            <label class="event__offer-label" for="event-offer-${alias}">
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

          ${types.map(({id, name, capitalizedName}) => `
            <div class="event__type-item">
              <input id="event-type-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${id}">
              <label class="event__type-label  event__type-label--${name}" for="event-type-${id}">${capitalizedName}</label>
            </div>
          `).join('')}
        </fieldset>
      </div>`
  );
}

function getEditFormTemplate(state, types, cities) {
  return (
    `<li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label class="event__type  event__type-btn" for="event-type-toggle-1">
                <span class="visually-hidden">Choose event type</span>
                <img class="event__type-icon" width="17" height="17" src="img/icons/${state.type.name}.png" alt="Event type icon">
              </label>
              <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

              ${getTypesTemplate(types)}
            </div>

            <div class="event__field-group  event__field-group--destination">
              <label class="event__label  event__type-output" for="event-destination-1">
                ${state.type.name}
              </label>
              <input class="event__input  event__input--destination"
              id="event-destination-1"
              type="text"
              name="event-destination"
              value="${state.destination.cityName}"
              list="destination-list-1"
              autocomplete="off"
              required>
              ${getCitiesSuggestions(cities)}
            </div>

            <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="event-start-time-1">From</label>
              <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${state.formStartDate}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">To</label>
              <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${state.formEndDate}">
            </div>

            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${state.price}">
            </div>

            <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">Delete</button>
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Open event</span>
            </button>
          </header>
          ${getPointDetails(state)}
        </form>
      </li>`
  );
}

export default class TripPointEditingFormView extends AbstractStatefulView {
  #pointTypes = null;
  #cities = null;
  #form = null;
  #rollupButton = null;
  #handleFormSubmit = null;
  #handleRollupButtonClick = null;
  #typeToggler = null;
  #typesDropdown = null;
  #typeOutput = null;
  #typeIcon = null;
  #destinationInput = null;
  #priceInput = null;
  #offersContainer = null;

  constructor({pointData, pointTypes, cities, onFormSubmit, onRollupButtonClick}) {
    super();
    this._setState(this.#parsePointDataToState(pointData));
    this.#pointTypes = pointTypes;
    this.#cities = cities;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupButtonClick = onRollupButtonClick;

    this.#setHandlers();
  }

  get template() {
    return getEditFormTemplate(this._state, this.#pointTypes, this.#cities);
  }

  _restoreHandlers() {
    this.#setHandlers();
  }

  parseStateToPointData() {
    return {...this._state};
  }

  #setHandlers = () => {
    this.#form = this.element.querySelector('form');
    this.#rollupButton = this.element.querySelector('.event__rollup-btn');
    this.#typeToggler = this.element.querySelector('.event__type-toggle');
    this.#typesDropdown = this.element.querySelector('.event__type-group');
    this.#typeOutput = this.element.querySelector('.event__type-output');
    this.#typeIcon = this.element.querySelector('.event__type-icon');
    this.#destinationInput = this.element.querySelector('.event__input--destination');
    this.#priceInput = this.element.querySelector('.event__input--price');
    this.#offersContainer = this.element.querySelector('.event__available-offers');

    this.#form.addEventListener('submit', this.#formSubmitHandler);
    this.#rollupButton.addEventListener('click', this.#rollupButtonClickHandler);
    this.#typesDropdown.addEventListener('change', (evt) => {
      this.#typeChangeHandler(evt);
    });
    this.#destinationInput.addEventListener('input', (evt) => {
      this.#destinationInputHandler(evt);
    });
    this.#priceInput.addEventListener('input', (evt) => {
      this.#priceInputHandler(evt);
    });
    this.#offersContainer?.addEventListener('change', (evt) => {
      this.#offerClickHandler(evt);
    });
  };

  #parsePointDataToState(data) {
    return {
      ...data
    };
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };

  #rollupButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupButtonClick();
  };

  #typeChangeHandler = (evt) => {
    const chosenTypeId = evt.target.value;
    const chosenTypeName = this.#pointTypes[chosenTypeId].name;

    this.updateElement({
      type: this.#pointTypes[chosenTypeId]
    });
    this.#typeOutput.textContent = capitalizeFirstLetter(chosenTypeName);
    this.#typeIcon.src = getTypeIconSrc(chosenTypeName);
    this.#typeToggler.checked = false;
  };

  #destinationInputHandler = (evt) => {
    const input = evt.target;
    const value = input.value;
    const allowedCities = this.#cities.map(({cityName}) => cityName);

    if (!allowedCities.includes(value)) {
      input.setCustomValidity(`Allowed cities: ${allowedCities.map((city) => city).join(', ')}`);
      return;
    }

    input.setCustomValidity('');
    this.updateElement({
      destination: this.#cities.find(({cityName}) => cityName === value)
    });
  };

  #priceInputHandler = (evt) => {
    const newPrice = evt.target.value;

    this._setState({
      price: newPrice
    });
  };

  #offerClickHandler = (evt) => {
    const clickedOffer = evt.target;
    const clickedOfferId = clickedOffer.value;
    const typeCopy = structuredClone(this._state.type);
    const targetOption = typeCopy.options.find(({id}) => id === Number(clickedOfferId));

    targetOption.checked = clickedOffer.checked;
    this._setState({
      type: typeCopy
    });
  };
}
