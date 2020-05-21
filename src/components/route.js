import {MONTH_NAMES} from '../const.js';
import AbstractComponent from './abstract-component.js';

const createAboutRouteTemplate = (cities, fullDataPoints) => {
  let stringVersionOfCities = ``;
  if (cities.length > 3) {
    stringVersionOfCities += `${cities[0]} — … — ${cities[cities.length - 1]}`;
  } else {
    stringVersionOfCities += `${cities[0]}`;
    for (let i = 1; i < cities.length; i++) {
      stringVersionOfCities += ` — ${cities[i]}`;
    }
  }

  let monthBegin;
  let dayBegin;
  let monthEnd;
  let dayEnd;
  if (fullDataPoints.length !== 0) {
    let days = fullDataPoints.map((oneDayOfPoints) => {
      return oneDayOfPoints[0].dateFrom;
    });

    monthBegin = MONTH_NAMES[days[0].getMonth()];
    dayBegin = days[0].getDate();
    monthEnd = (monthBegin ===
      MONTH_NAMES[days[days.length - 1].getMonth()]) ? `` :
      MONTH_NAMES[days[days.length - 1].getMonth()];
    dayEnd = days[days.length - 1].getDate();
  } else {
    monthBegin = ``;
    dayBegin = ``;
    monthEnd = ``;
    dayEnd = ``;
  }

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${stringVersionOfCities}</h1>

      <p class="trip-info__dates">${monthBegin} ${dayBegin} &nbsp;&mdash;&nbsp; ${monthEnd} ${dayEnd}</p>
    </div>`
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
