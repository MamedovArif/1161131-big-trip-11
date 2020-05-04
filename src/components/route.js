import {MONTH_NAMES} from '../const.js';
import AbstractComponent from './abstract-component.js';

const createAboutRouteTemplate = (array, fullDataPoints) => {
  let cities = Array.from(array);

  let citiesString = ``;
  for (let i = 0; i < cities.length; i++) {
    citiesString += `${cities[i]} — `;
  }

  let days = fullDataPoints.map((littleArray) => {
    return littleArray[0].timeBegin;
  });

  const monthBegin = MONTH_NAMES[days[0].getMonth()];
  const dayBegin = days[0].getDate();
  const monthEnd = (monthBegin ===
    MONTH_NAMES[days[days.length - 1].getMonth()]) ? `` :
    MONTH_NAMES[days[days.length - 1].getMonth()];
  const dayEnd = days[days.length - 1].getDate();

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${citiesString.slice(0, citiesString.length - 2)}</h1>

        <p class="trip-info__dates">${monthBegin} ${dayBegin} &nbsp;&mdash;&nbsp; ${monthEnd} ${dayEnd}</p>
      </div>
    </section>`
  );
};

export default class Route extends AbstractComponent {
  constructor(cities, fullDataPoints) {
    super();
    this._cities = cities;
    this._fullDataPoints = fullDataPoints;
  }

  getTemplate() {
    return createAboutRouteTemplate(this._cities, this._fullDataPoints);
  }
}
