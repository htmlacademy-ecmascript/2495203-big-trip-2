import AbstractView from '../framework/view/abstract-view.js';

function createStartDateTemplate(start) {
  return `${start.day} ${start.month}`;
}

function createEndDateTemplate(end) {
  return `&nbsp;&mdash;&nbsp;${end.day}&nbsp;${end.month}`;
}

function createDatesTemplate(dates) {
  const start = dates.start;
  const end = dates.end;
  return (
    `<p class="trip-info__dates">${createStartDateTemplate(start)}${end ? createEndDateTemplate(end) : ''}</p>`
  );
}

function createTripMainInfoTemplate(mainInfo) {
  const dates = mainInfo.dates;
  const cities = mainInfo.cities;

  return (
    `<section class="trip-main__trip-info trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${cities}</h1>

              ${dates ? createDatesTemplate(dates) : ''}
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
            </p>
          </section>`
  );
}

export default class TripMainInfoView extends AbstractView {
  #mainInfo = null;

  constructor({mainInfo}) {
    super();
    this.#mainInfo = mainInfo;
  }

  get template() {
    return createTripMainInfoTemplate(this.#mainInfo);
  }
}
