import {castTimeFormat} from '../utils.js';
import {MONTH_NAMES} from '../const.js';

const generateDays = (object, counter) => {
  const {date} = object;

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

const listTrips = (array) => {
  return (
    `<ul class="trip-days">
      ${array.join(`\n`)}
    </ul> `
  );
};

export {listTrips, generateDays};
