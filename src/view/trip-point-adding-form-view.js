import {createElement} from '../render.js';
import {capitalizeFirstLetter, formatAddingFormDate} from '../utils.js';

function getPhotosList(photos) {
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
    `<div class="event__available-offers">
      ${offersData.map(({name, price, alias}) => `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${alias}-1" type="checkbox" name="event-offer-${alias}">
          <label class="event__offer-label" for="event-offer-${alias}-1">
            <span class="event__offer-title">${name}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
        </div>
      `).join('')}
    </div>`
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
          ${pointTypes.map(({name}) => `
          <div class="event__type-item">
            <input id="event-type-${name}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${name}">
            <label class="event__type-label  event__type-label--${name}" for="event-type-${name}-1">${capitalizeFirstLetter(name)}</label>
          </div>
          `).join('')}
        </fieldset>
      </div>`
  );
}

function getAddTripPointFormTemplate({blankPoint, pointTypes, cities}) {
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
                      ${blankPoint.type.name}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${cities[0].cityName}" list="destination-list-1">
                    ${getCitySuggestions(cities)}
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatAddingFormDate(blankPoint.startDate)}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatAddingFormDate(blankPoint.endDate)}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${blankPoint.price}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Cancel</button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

                    ${getOffers(blankPoint.type.options)}
                  </section>

                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${cities[0].description}</p>
                    ${getPhotosList(cities[0].photos)}
                  </section>
                </section>
              </form>
            </li>`;
}

export default class TripPointAddingFormView {
  constructor(pointsModel) {
    this.pointsModel = pointsModel;
    this.cities = pointsModel.getCities();
    this.pointTypes = pointsModel.getPointTypes();
    this.blankPointData = pointsModel.getBlankPoint();
  }

  getTemplate() {
    return getAddTripPointFormTemplate({
      blankPoint: this.blankPointData,
      pointTypes: this.pointTypes,
      cities: this.cities
    });
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
