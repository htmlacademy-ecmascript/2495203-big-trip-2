import AbstractView from '../framework/view/abstract-view.js';

function getOffersTemplate(offersData) {
  return (
    `<ul class="event__selected-offers">
        ${offersData.map(({name, price}) => `<li class="event__offer">
            <span class="event__offer-title">${name}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </li>
        `).join('')}
      </ul>`
  );
}

function getTripPointTemplate(pointData) {
  return `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${pointData.htmlStartDate}">${pointData.formattedDate}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/taxi.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${pointData.type.name} ${pointData.destination.cityName}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${pointData.startDateISO}">${pointData.startTime}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${pointData.endDateISO}">${pointData.endTime}</time>
                  </p>
                  <p class="event__duration">${pointData.duration}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${pointData.price}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                ${pointData.type.options.length ? getOffersTemplate(pointData.type.options) : ''}
                <button class="event__favorite-btn${pointData.isFavorite ? ' event__favorite-btn--active' : ''}"
                        type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`;
}

export default class TripPointView extends AbstractView {
  #pointData = null;
  #pointTypes = null;
  #editButton = null;
  #favoriteButton = null;
  #cities = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({pointData, pointTypes, cities, onEditClick, onFavoriteClick}) {
    super();
    this.#pointData = pointData;
    this.#pointTypes = pointTypes;
    this.#cities = cities;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.#editButton = this.element.querySelector('.event__rollup-btn');
    this.#favoriteButton = this.element.querySelector('.event__favorite-btn');

    this.#editButton.addEventListener('click', this.#editClickHandler);
    this.#favoriteButton.addEventListener('click', this.#favoriteButtonClickHandler);
  }

  get template() {
    return getTripPointTemplate(this.#pointData);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
