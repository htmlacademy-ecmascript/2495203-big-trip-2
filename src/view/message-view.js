import AbstractView from '../framework/view/abstract-view.js';

function getMessageTemplate() {
  return (
    `<p class="trip-events__msg">Click New Event to create your first point</p>

    <!--
      Значение отображаемого текста зависит от выбранного фильтра:
        * Everything – 'Click New Event to create your first point'
        * Past — 'There are no past events now';
        * Present — 'There are no present events now';
        * Future — 'There are no future events now'.
    -->`
  );
}

export default class MessageView extends AbstractView {
  get template() {
    return getMessageTemplate();
  }
}
