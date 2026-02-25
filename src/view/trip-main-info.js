import AbstractView from '../framework/view/abstract-view.js';
import {SYMBOL} from '../constants.js';
import he from 'he';

function createStartDateTemplate(start) {
  return `${start.day} ${start.month}`;
}

function createEndDateTemplate(end) {
  return `${SYMBOL.NBSP}${SYMBOL.MDASH}${SYMBOL.NBSP}${end.day}${SYMBOL.NBSP}${end.month}`;
}

function createDatesTemplate(dates) {
  const start = dates.start;
  const end = dates.end;
  return (
    `<p class="trip-info__dates">${he.decode(createStartDateTemplate(start))}${end ? he.decode(createEndDateTemplate(end)) : ''}</p>`
  );
}

function createTripMainInfoTemplate({dates, cities, cost}) {
  return (
    `<section class="trip-main__trip-info trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${he.decode(cities)}</h1>

              ${dates ? he.decode(createDatesTemplate(dates)) : ''}
            </div>

            <p class="trip-info__cost">
              Total: ${SYMBOL.EURO}${SYMBOL.NBSP}<span class="trip-info__cost-value">${he.decode(String(cost))}</span>
            </p>
          </section>`
  );
}

export default class TripMainInfoView extends AbstractView {
  #mainInfo;

  constructor({mainInfo}) {
    super();
    this.#mainInfo = mainInfo;
  }

  get template() {
    return createTripMainInfoTemplate(this.#mainInfo);
  }
}
