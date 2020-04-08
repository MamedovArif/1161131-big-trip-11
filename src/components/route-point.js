import {formatTime} from "../utils.js";
import {getRandomArrayItem, getRandomIntegerNumber} from "../mock/route-point.js";

const generateOptions = (offer, cost) => {
  return (
    `<li class="event__offer">
      <span class="event__offer-title">${offer}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${cost}</span>
    </li>`
  );
}


const createRoutePointTemplate = (object) => {
  const {type, city, timeBegin, timeEnd, price, options} = object;

  const diffTime = (begin, end) => {
    let minutes = (end - begin)/(1000 * 60);
    let days;
    let hours;
    let result = ``;
    if (minutes >= 24 * 60) {
      days = Math.floor(minutes / (60 * 24));
      minutes = minutes % (60 * 24);
      result += `${days}D `;
    }
    if (minutes >= 60) {
      hours = Math.floor(minutes / 60);
      minutes = minutes % 60;
      result += `${hours}H `
    }
    result += `${minutes}M`
    return result;
  }

  const offers = [];
  let randomNumber = getRandomIntegerNumber(0, 3);

  for (let i = 0; i <= randomNumber; i++) {
    offers.push(generateOptions(getRandomArrayItem(options.offer),
      getRandomArrayItem(options.cost)));
  };

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} to ${city}</h3>

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
          ${offers.join('\n')}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export {createRoutePointTemplate};
