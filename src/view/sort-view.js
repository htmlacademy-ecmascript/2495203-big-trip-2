import AbstractView from '../framework/view/abstract-view.js';

function getSortTemplate() {
  return '<form class="trip-events__trip-sort  trip-sort" action="#" method="get">\n' +
    '            <div class="trip-sort__item  trip-sort__item--day">\n' +
    '              <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day">\n' +
    '              <label class="trip-sort__btn" for="sort-day">Day</label>\n' +
    '            </div>\n' +
    '\n' +
    '            <div class="trip-sort__item  trip-sort__item--event">\n' +
    '              <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>\n' +
    '              <label class="trip-sort__btn" for="sort-event">Event</label>\n' +
    '            </div>\n' +
    '\n' +
    '            <div class="trip-sort__item  trip-sort__item--time">\n' +
    '              <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time">\n' +
    '              <label class="trip-sort__btn" for="sort-time">Time</label>\n' +
    '            </div>\n' +
    '\n' +
    '            <div class="trip-sort__item  trip-sort__item--price">\n' +
    '              <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" checked>\n' +
    '              <label class="trip-sort__btn" for="sort-price">Price</label>\n' +
    '            </div>\n' +
    '\n' +
    '            <div class="trip-sort__item  trip-sort__item--offer">\n' +
    '              <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>\n' +
    '              <label class="trip-sort__btn" for="sort-offer">Offers</label>\n' +
    '            </div>\n' +
    '          </form>';
}

export default class SortView extends AbstractView {
  get template() {
    return getSortTemplate();
  }
}
