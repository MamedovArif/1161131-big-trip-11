import {createAboutRouteTemplate} from './components/route.js';
import {createCostOfTripTemplate} from './components/cost.js';
import {createMenuTemplate} from './components/menu.js';
import {createFiltersTemplate} from './components/filters.js';
import {createSortTemplate} from './components/sort.js';
import {createEditingFormTemplate} from './components/editing-form.js';
import {createRoutePointTemplate} from './components/route-point.js';
import {listTrips, generateDays} from './components/list-trips.js';

import {generatePoints} from './mock/route-point.js';
import {generateDate} from './mock/list-trips.js';

const NUMBER_OF_STOPS = 4;
const QUANTITY_OF_DAYS = 3;

const render = (container, component, place) => {
  container.insertAdjacentHTML(place, component);
};

const tripMain = document.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);
const pageMain = document.querySelector(`.page-main`);
const tripEvents = pageMain.querySelector(`.trip-events`);

render(tripMain, createAboutRouteTemplate(), `afterbegin`);

const tripInfo = tripMain.querySelector(`.trip-info`);

render(tripInfo, createCostOfTripTemplate(), `beforeend`);
render(tripControls, createFiltersTemplate(), `beforeend`);
render(tripControls.children[0], createMenuTemplate(), `afterend`);
render(tripEvents, createSortTemplate(), `beforeend`);
render(tripEvents, createEditingFormTemplate(), `beforeend`);

const week = [];
for (let y = 0; y < QUANTITY_OF_DAYS; y++) {
  week.push(generateDate());
};
console.log(week);

week.sort((a, b) => a.date - b.date);
console.log(week);

const days = week.map((item, counter) => {
  return generateDays(item, counter);
});

render(tripEvents, listTrips(days), `beforeend`);

const list = tripEvents.querySelectorAll(`.trip-events__list`);

for (let j = 0; j < list.length; j++) {
  const points = generatePoints(NUMBER_OF_STOPS);

  for (let i = 0; i < points.length; i++) {
    render(list[j], createRoutePointTemplate(points[i]), `beforeend`);
  }
}
