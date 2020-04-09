import {createAboutRouteTemplate} from './components/route.js';
import {createCostOfTripTemplate} from './components/cost.js';
import {createMenuTemplate} from './components/menu.js';
import {createFiltersTemplate} from './components/filters.js';
import {createSortTemplate} from './components/sort.js';
import {createEditingFormTemplate} from './components/editing-form.js';
import {createRoutePointTemplate} from './components/route-point.js';
import {listTrips, generateDays} from './components/list-trips.js';

import {generatePoints, defaultData} from './mock/route-point.js';
import {generateDate} from './mock/list-trips.js';

const NUMBER_OF_STOPS = 4;
const QUANTITY_OF_DAYS = 3;

const render = (container, component, place) => {
  container.insertAdjacentHTML(place, component);
};

const tripMain = document.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);

const tripEvents = document.querySelector(`.trip-events`);

render(tripControls.children[0], createMenuTemplate(), `afterend`);
render(tripControls, createFiltersTemplate(), `beforeend`);

render(tripEvents, createSortTemplate(), `beforeend`); // b1
render(tripEvents, createEditingFormTemplate(defaultData), `beforeend`); // b2

const week = [];
for (let y = 0; y < QUANTITY_OF_DAYS; y++) {
  week.push(generateDate());
};

week.sort((a, b) => a.date - b.date);

const days = week.map((item, counter) => {
  return generateDays(item, counter);
});

render(tripEvents, listTrips(days), `beforeend`);


const listDays = tripEvents.querySelectorAll(`.trip-events__list`);

let totalCosts = [];
let routeOfCities = new Set();

for (let j = 0; j < listDays.length; j++) {
  const points = generatePoints(NUMBER_OF_STOPS);

  for (let i = 0; i < points.length; i++) {
    totalCosts.push(points[i].price);
    routeOfCities.add(points[i].city);
    render(listDays[j], createRoutePointTemplate(points[i]), `beforeend`);
  }
};

render(tripMain, createAboutRouteTemplate(routeOfCities), `afterbegin`); //a1
const tripInfo = tripMain.querySelector(`.trip-info`);//a2
render(tripInfo, createCostOfTripTemplate(totalCosts), `beforeend`);//a3

