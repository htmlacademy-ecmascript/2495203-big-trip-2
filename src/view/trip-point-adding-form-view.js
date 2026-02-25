import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {
  destinationInputHandler,
  offerClickHandler,
  priceInputHandler,
  typeChangeHandler
} from '../form-handlers.js';
import {nanoid} from 'nanoid';
import he from 'he';
import {initFlatpickr} from '../utils.js';
import {ACTION, SYMBOL} from '../constants.js';

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
  if (!photos?.length) {
    return;
  }

  return (
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${photos.map((photo) => `
            <img class="event__photo" src="${he.encode(photo.src)}" alt="${he.encode(photo.description)}">
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
        ${offersData.map(({id, name, price, alias, checked}) => `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden"
            id="event-offer-${he.encode(alias)}"
            type="checkbox"
            name="event-offer-${he.encode(alias)}"
            value="${he.encode(id)}"
            ${checked ? 'checked' : ''}>
            <label class="event__offer-label" for="event-offer-${he.encode(alias)}">
              <span class="event__offer-title">${he.encode(name)}</span>
              ${SYMBOL.PLUS}${SYMBOL.EURO}${SYMBOL.NBSP}
              <span class="event__offer-price">${he.encode(String(price))}</span>
            </label>
          </div>
        `).join('')}
      </div>
    </section>`
  );
}

function getDescription(destination) {
  if (!destination.description?.length) {
    return '';
  }

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${he.encode(destination.description)}</p>
      ${getPhotosList(destination)}
    </section>`
  );
}

function getCitySuggestions(cities) {
  return (
    `<datalist id="destination-list-1">
        ${cities.map(({cityName}) => `
        <option value="${he.encode(cityName)}"></option>
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
            <input id="event-type-${he.encode(String(id))}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${he.encode(String(id))}">
            <label class="event__type-label  event__type-label--${he.encode(name)}" for="event-type-${he.encode(String(id))}">${he.encode(capitalizedName)}</label>
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
                  <label class="event__type  event__type-btn" for="event-type-toggle">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/${he.encode(state.type.name)}.png" alt="${he.encode(state.type.name)}">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle" type="checkbox">

                  ${getEventTypesListTemplate(pointTypes)}
                </div>

                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">
                    ${he.encode(state.type.name)}
                  </label>
                  <input class="event__input  event__input--destination"
                  id="event-destination-1"
                  type="text"
                  name="event-destination"
                  value="${state.destination ? he.encode(state.destination.cityName) : ''}"
                  list="destination-list-1"
                  autocomplete="off"
                  required>
                  ${getCitySuggestions(cities)}
                </div>

                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time">From</label>
                  <input class="event__input  event__input--time"
                  id="event-start-time"
                  type="text"
                  name="event-start-time"
                  value="${state.formattedStartDate ? he.encode(state.formattedStartDate) : ''}">
                  ${(state.formattedStartDate && state.formattedEndDate) ? SYMBOL.MDASH : ''}
                  <label class="visually-hidden" for="event-end-time">To</label>
                  <input class="event__input  event__input--time"
                  id="event-end-time"
                  type="text"
                  name="event-end-time"
                  value="${state.formattedEndDate ? he.encode(state.formattedEndDate) : ''}">
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    ${SYMBOL.EURO}
                  </label>
                  <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${he.encode(String(state.price))}">
                </div>

                <button class="event__save-btn  btn  btn--blue"
                    type="submit"
                    ${state.isDisabled ? 'disabled' : ''}>
                    ${state.isSaving ? ACTION.SAVING : ACTION.SAVE}
                </button>
                <button class="event__reset-btn" type="reset">Cancel</button>
              </header>
              ${getDetailsTemplate(state)}
              </section>
            </form>
          </li>`;
}

export default class TripPointAddingFormView extends AbstractStatefulView {
  #cities;
  #pointTypes;
  #form;
  #cancelButton;
  #handleFormSubmit;
  #typeToggler;
  #typesDropdown;
  #typeOutput;
  #typeIcon;
  #destinationInput;
  #priceInput;
  #offersContainer;
  #startPicker;
  #endPicker;
  #handleCancelButtonClick;

  constructor({cities, pointTypes, blankPoint, onFormSubmit, onCancelButtonClick}) {
    super();
    this.#cities = cities;
    this.#pointTypes = pointTypes;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleCancelButtonClick = onCancelButtonClick;

    this._setState({
      ...this.#parseDataToState(blankPoint),
      isSaving: false,
      isDisabled: false,
    });

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

  get startPicker() {
    return this.#startPicker;
  }

  get endPicker() {
    return this.#endPicker;
  }

  set startPicker(pickerInstance) {
    this.#startPicker = pickerInstance;
  }

  set endPicker(pickerInstance) {
    this.#endPicker = pickerInstance;
  }

  set state(update) {
    this._setState(update);
  }

  _restoreHandlers() {
    this.#setHandlers();
  }

  removeElement() {
    super.removeElement();

    if (this.#startPicker) {
      this.#startPicker.destroy();
      this.#startPicker = null;
    }

    if (this.#endPicker) {
      this.#endPicker.destroy();
      this.#endPicker = null;
    }
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

    initFlatpickr(this);
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
    const data = {...this._state};

    delete data.isSaving;
    delete data.isDisabled;

    return data;
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this.#parseStateToData());
  };
}
