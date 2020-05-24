import {castTimeFormat} from '../utils/common.js';
import {MONTH_NAMES} from '../const.js';
import AbstractComponent from "./abstract-component.js";

export const generateDays = (date, counter) => {
  const dateAttribute =
  `${date.getFullYear()}-${castTimeFormat(date.getMonth())}-${castTimeFormat(date.getDate())}`;

  const dateVisual = `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`;
  return (
    `<li class="trip-days__item day">
      <div class="day__info">
        <span class="day__counter">${counter + 1}</span>
        <time class="day__date" datetime="${dateAttribute}">${dateVisual}</time>
      </div>
      <ul class="trip-events__list"></ul>
    </li>`
  );
};

const listTrips = (fullPoints) => {
  let days;
  if (fullPoints.length === 0) {
    days = ``;
  } else {
    days = fullPoints.map((oneDayOfPoints, counter) => {
      const date = oneDayOfPoints[0].dateFrom;
      return generateDays(date, counter);
    });
    days = days.join(`\n`);
  }

  return (
    `<ul class="trip-days">
      ${days}
    </ul> `
  );
};

export default class ListOfDays extends AbstractComponent {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return listTrips(this._points);
  }
}
