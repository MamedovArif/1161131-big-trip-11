import {createAboutRouteTemplate} from './components/route.js';
import {createCostOfTripTemplate} from './components/cost.js';
import {createMenuTemplate} from './components/menu.js';
import {createFiltersTemplate} from './components/filters.js';
import {createSortTemplate} from './components/sort.js';
import {createEditingFormTemplate} from './components/editing-form.js';
import {createRoutePointTemplate} from './components/route-point.js';
import {listTrips} from './components/list-trips.js';

import {generatePoints} from './mock/route-point.js';

const NUMBER_OF_STOPS = 15;

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

render(tripEvents, listTrips(), `beforeend`);

const list = tripEvents.querySelector(`.trip-events__list`);

const points = generatePoints(NUMBER_OF_STOPS);

for (let i = 0; i < points.length; i++) {
  render(list, createRoutePointTemplate(points[i]), `beforeend`);
}

