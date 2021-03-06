import {formatTime, diffTime, upperFirstElement} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";
import {pretext} from "../const.js";

const generateOptions = (offer, cost) => {
  return (
    `<li class="event__offer">
      <span class="event__offer-title">${offer}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${cost}</span>
    </li>`
  );
};

const createRoutePointTemplate = (dataForPoint) => {
  const {type, dateFrom, dateTo, basePrice, offers} = dataForPoint;
  let destination = dataForPoint.destination;

  if (destination === null) {
    destination = {};
    destination.name = ``;
  }

  const options = [];
  for (let i = 0; i < Math.min(3, offers.length); i++) {
    options.push(generateOptions(offers[i].title, offers[i].price));
  }

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${upperFirstElement(type)} ${pretext[type]} ${destination.name}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${formatTime(dateFrom)}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${formatTime(dateTo)}</time>
          </p>
          <p class="event__duration">${diffTime(dateFrom, dateTo)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${options.join(`\n`)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class PointOfRoute extends AbstractComponent {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createRoutePointTemplate(this._data);
  }

  setClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, handler);
  }
}
