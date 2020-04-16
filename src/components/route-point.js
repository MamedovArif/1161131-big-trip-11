import {formatTime, diffTime, createElement} from "../utils.js";
import {getRandomArrayItem, getRandomIntegerNumber} from "../mock/route-point.js";

const generateOptions = (offer, cost) => {
  return (
    `<li class="event__offer">
      <span class="event__offer-title">${offer}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${cost}</span>
    </li>`
  );
};

const createRoutePointTemplate = (object) => {
  const {type, city, timeBegin, timeEnd, price, options} = object;

  const offers = [];
  let randomNumber = getRandomIntegerNumber(0, 3);

  for (let i = 0; i <= randomNumber; i++) {
    offers.push(generateOptions(getRandomArrayItem(options.offer),
        getRandomArrayItem(options.cost)));
  }

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${options.pretext} ${city}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${timeBegin}">${formatTime(timeBegin)}</time>
            &mdash;
            <time class="event__end-time" datetime="${timeEnd}">${formatTime(timeEnd)}</time>
          </p>
          <p class="event__duration">${diffTime(timeBegin, timeEnd)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offers.join(`\n`)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class PointOfRoute {
  constructor(data) {
    this._data = data;
    this._element = null;
  }

  getTemplate() {
    return createRoutePointTemplate(this._data);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
