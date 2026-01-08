import {remove} from '../framework/render.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {
  destinationInputHandler,
  offerClickHandler,
  priceInputHandler,
  typeChangeHandler
} from '../form-handlers.js';
import {nanoid} from 'nanoid';

function getDetailsTemplate(state) {
  if (!(state.type.options || state.destination)) {
    return;
  }

  return (
    `<section class="event__details">
      ${state.type.options ? getOffers(state.type.options) : ''}
      ${state.destination ? getDescription(state.destination) : ''}
    </section>`
  );
}

function getPhotosList({photos}) {
  if (!photos) {
    return;
  }

  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${photos.map((photo) => `
            <img class="event__photo" src="${photo}" alt="Event photo">
        `).join('')}
      </div>
    </div>`
  );
}

function getOffers(offersData) {
  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${offersData.map(({id, name, price, alias}) => `
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

function getDescription(destination) {
  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>
      ${getPhotosList(destination)}
    </section>`
  );
}

function getCitySuggestions(cities) {
  return (
    `<datalist id="destination-list-1">
        ${cities.map(({cityName}) => `
        <option value="${cityName}"></option>
        `).join('')}
      </datalist>`
  );
}

function getEventTypesListTemplate(pointTypes) {
  return (
    `<div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${pointTypes.map(({id, name, capitalizedName}) => `
          <div class="event__type-item">
            <input id="event-type-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${id}">
            <label class="event__type-label  event__type-label--${name}" for="event-type-${id}">${capitalizedName}</label>
          </div>
          `).join('')}
        </fieldset>
      </div>`
  );
}

function getAddTripPointFormTemplate({state, pointTypes, cities}) {
  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                  ${getEventTypesListTemplate(pointTypes)}
                </div>

                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">
                    ${state.type.name}
                  </label>
                  <input class="event__input  event__input--destination"
                  id="event-destination-1"
                  type="text"
                  name="event-destination"
                  value="${state.destination ? state.destination.cityName : ''}"
                  list="destination-list-1"
                  autocomplete="off"
                  required>
                  ${getCitySuggestions(cities)}
                </div>

                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-1">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${state.formattedStartDate ?? ''}">
                  ${(state.formattedStartDate && state.formattedEndDate) ? '&mdash;' : ''}
                  <label class="visually-hidden" for="event-end-time-1">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${state.formattedEndDate ?? ''}">
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${state.price}">
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                <button class="event__reset-btn" type="reset">Cancel</button>
              </header>
              ${getDetailsTemplate(state)}
              </section>
            </form>
          </li>`;
}

export default class TripPointAddingFormView extends AbstractStatefulView {
  #cities = null;
  #pointTypes = null;
  #form = null;
  #cancelButton = null;
  #handleFormSubmit = null;
  #typeToggler = null;
  #typesDropdown = null;
  #typeOutput = null;
  #typeIcon = null;
  #destinationInput = null;
  #priceInput = null;
  #offersContainer = null;
  #addButtonView = null;

  constructor({cities, pointTypes, blankPoint, onFormSubmit, addButtonView}) {
    super();
    this.#cities = cities;
    this.#pointTypes = pointTypes;
    this.#handleFormSubmit = onFormSubmit;
    this.#addButtonView = addButtonView;

    this._setState(this.#parseDataToState(blankPoint));
    this.#setHandlers();
  }

  get template() {
    return getAddTripPointFormTemplate({
      state: this._state,
      pointTypes: this.#pointTypes,
      cities: this.#cities
    });
  }

  get state() {
    return this._state;
  }

  get pointTypes() {
    return this.#pointTypes;
  }

  get cities() {
    return this.#cities;
  }

  get typesOutput() {
    return this.#typeOutput;
  }

  get typeIcon() {
    return this.#typeIcon;
  }

  get typeToggler() {
    return this.#typeToggler;
  }

  set state(update) {
    this._setState(update);
  }

  _restoreHandlers() {
    this.#setHandlers();
  }

  #setHandlers = () => {
    this.#form = this.element.querySelector('form');
    this.#cancelButton = this.element.querySelector('.event__reset-btn');
    this.#typeToggler = this.element.querySelector('.event__type-toggle');
    this.#typesDropdown = this.element.querySelector('.event__type-group');
    this.#typeOutput = this.element.querySelector('.event__type-output');
    this.#typeIcon = this.element.querySelector('.event__type-icon');
    this.#destinationInput = this.element.querySelector('.event__input--destination');
    this.#priceInput = this.element.querySelector('.event__input--price');
    this.#offersContainer = this.element.querySelector('.event__available-offers');

    this.#form.addEventListener('submit', (evt) => {
      this.#formSubmitHandler(evt);
    });
    this.#cancelButton.addEventListener('click', this.#handleCancelButtonClick);

    this.#typesDropdown.addEventListener('change', (evt) => {
      typeChangeHandler({evt, component: this});
    });
    this.#destinationInput.addEventListener('input', (evt) => {
      destinationInputHandler({evt, component: this});
    });
    this.#priceInput.addEventListener('input', (evt) => {
      priceInputHandler({evt, component: this});
    });
    this.#offersContainer?.addEventListener('change', (evt) => {
      offerClickHandler({evt, component: this});
    });
  };

  #parseDataToState(data) {
    return {
      ...data,
      destination: null,
      duration: null,
      endDate: null,
      endDateISO: null,
      endTime: null,
      formEndDate: null,
      formStartDate: null,
      formattedDate: null,
      headerFormattedStartDate: null,
      headerFormattedEndDate: null,
      htmlEndDate: null,
      htmlStartDate: null,
      id: nanoid(),
      isFavorite: false,
      startDate: null,
      startDateISO: null,
      startTime: null
    };
  }

  #parseStateToData() {
    return {...this._state};
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this.#parseStateToData());
    remove(this);
  };

  #handleCancelButtonClick = () => {
    remove(this);
    this.#addButtonView.element.disabled = false;
  };
}
