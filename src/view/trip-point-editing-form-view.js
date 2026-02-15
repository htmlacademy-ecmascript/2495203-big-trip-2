import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {
  destinationInputHandler,
  offerClickHandler,
  priceInputHandler,
  typeChangeHandler
} from '../form-handlers.js';
import {
  initFlatpickr
} from '../utils.js';
import he from 'he';
import {BUTTON_TEXT, SYMBOL} from '../constants.js';

function getPointDetails(state) {
  if (!(state.type.options || state.destination.description)) {
    return '';
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
        <p class="event__destination-description">${he.encode(description)}</p>
    </section>`
  );
}

function getOffersTemplate(offers) {
  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offers.map(({id, name, alias, price, checked}) => `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden"
            id="event-offer-${alias}"
            type="checkbox"
            name="event-offer-${alias}"
            value="${id}"
            ${checked ? 'checked' : ''}>
            <label class="event__offer-label" for="event-offer-${alias}">
              <span class="event__offer-title">${name}</span>
              ${SYMBOL.PLUS}${SYMBOL.EURO}${SYMBOL.NBSP}
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
        <option value="${he.encode(cityName)}"></option>
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
              <label class="visually-hidden" for="event-start-time">From</label>
              <input class="event__input  event__input--time" id="event-start-time" type="text" name="event-start-time" value="${state.formStartDate}">
              ${SYMBOL.MDASH}
              <label class="visually-hidden" for="event-end-time">To</label>
              <input class="event__input  event__input--time" id="event-end-time" type="text" name="event-end-time" value="${state.formEndDate}">
            </div>

            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>
                ${SYMBOL.EURO}
              </label>
              <input class="event__input  event__input--price"
              id="event-price-1"
              type="number"
              name="event-price"
              value="${state.price}">
            </div>

            <button class="event__save-btn  btn  btn--blue"
                    type="submit"
                    ${state.isDisabled ? 'disabled' : ''}>
                    ${state.isSaving ? BUTTON_TEXT.SAVING : BUTTON_TEXT.SAVE}
            </button>
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
  #pointTypes;
  #cities;
  #form;
  #rollupButton;
  #handleFormSubmit;
  #handleRollupButtonClick;
  #handleDeleteButtonClick;
  #typeToggler;
  #typesDropdown;
  #typeOutput;
  #typeIcon;
  #destinationInput;
  #priceInput;
  #offersContainer;
  #startPicker;
  #endPicker;
  #deleteButton;

  constructor({pointData, pointTypes, cities, onFormSubmit, onRollupButtonClick, onDeleteClick}) {
    super();
    this._setState(this.#parsePointDataToState(pointData));
    this.state = {
      isSaving: false,
      isDeleting: false,
      isDisabled: false,
    };
    this.#pointTypes = pointTypes;
    this.#cities = cities;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleRollupButtonClick = onRollupButtonClick;
    this.#handleDeleteButtonClick = onDeleteClick;

    this.#setHandlers();
  }

  get template() {
    return getEditFormTemplate(this._state, this.#pointTypes, this.#cities);
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

  parseStateToPointData() {
    const data = {...this._state};
    delete data.isSaving;
    delete data.isDeleting;
    delete data.isDisabled;

    return data;
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
    this.#deleteButton = this.element.querySelector('.event__reset-btn');

    this.#form.addEventListener('submit', this.#formSubmitHandler);
    this.#rollupButton.addEventListener('click', this.#rollupButtonClickHandler);
    this.#deleteButton.addEventListener('click', this.#deleteButtonClickHandler);

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

  #deleteButtonClickHandler = () => {
    this.#handleDeleteButtonClick(this.state.id);
  };
}
