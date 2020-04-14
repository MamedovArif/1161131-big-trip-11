import {MONTH_NAMES} from '../const.js';
import {createElement} from '../utils.js';

const createAboutRouteTemplate = (array, days) => {
  let cities = Array.from(array);

  let citiesString = ``;
  for (let i = 0; i < cities.length; i++) {
    citiesString += `${cities[i]} — `;
  }

  const monthBegin = MONTH_NAMES[days[0].date.getMonth()];
  const dayBegin = days[0].date.getDate();
  const monthEnd = (monthBegin ===
    MONTH_NAMES[days[days.length - 1].date.getMonth()]) ? `` :
    MONTH_NAMES[days[days.length - 1].date.getMonth()];
  const dayEnd = days[days.length - 1].date.getDate();

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${citiesString.slice(0, citiesString.length - 2)}</h1>

        <p class="trip-info__dates">${monthBegin} ${dayBegin} &nbsp;&mdash;&nbsp; ${monthEnd} ${dayEnd}</p>
      </div>
    </section>`
  );
};

export default class Route {
  constructor(cities, days) {
    this._cities = cities;
    this._days = days;
    this._element = null;
  }

  getTemplate() {
    return createAboutRouteTemplate(this._cities, this._days);
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
