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

const NUMBER_OF_STOPS = 3;
const QUANTITY_OF_DAYS = 4;

export const render = (container, component, place) => {
  container.insertAdjacentHTML(place, component);
};

const tripMain = document.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);

const tripEvents = document.querySelector(`.trip-events`);

render(tripControls.children[0], createMenuTemplate(), `afterend`);
render(tripControls, createFiltersTemplate(), `beforeend`);

render(tripEvents, createSortTemplate(), `beforeend`); // b1

const sortForm = tripEvents.querySelector(`.trip-events__trip-sort`);

const createForm = () => {
  render(sortForm, createEditingFormTemplate(defaultData), `afterend`); // b2
  buttonEvent.removeEventListener(`click`, createForm);
  const buttonSave = tripEvents.querySelector(`.event__save-btn`);
  buttonSave.addEventListener(`click`, function () {
    tripEvents.querySelector(`form[class = "trip-events__item  event  event--edit"]`).remove();
    buttonEvent.addEventListener(`click`, createForm);
  });
};

const buttonEvent = tripMain.querySelector(`.btn`);
buttonEvent.addEventListener(`click`, createForm);


const week = [];
for (let y = 0; y < QUANTITY_OF_DAYS; y++) {
  week.push(generateDate());
}

week.sort((a, b) => a.date - b.date);

const days = week.map((item, counter) => {
  return generateDays(item, counter);
});

render(tripEvents, listTrips(days), `beforeend`);


const listDays = tripEvents.querySelectorAll(`.trip-events__list`);

let totalCosts = [];
let routeOfCities = new Set();
let globalArray = [];

for (let j = 0; j < listDays.length; j++) {
  const points = generatePoints(NUMBER_OF_STOPS, week[j].date);
  points.sort((a, b) => {
    return a.timeBegin - b.timeBegin;
  });

  globalArray = globalArray.concat([...points]);

  for (let i = 0; i < points.length; i++) {
    totalCosts.push(points[i].price);
    routeOfCities.add(points[i].city);
    render(listDays[j], createRoutePointTemplate(points[i]), `beforeend`);
  }
}

const funcAdd = (evt, index, place) => {
  evt.preventDefault();
  const obj = globalArray[index];
  render(place.parentElement.parentElement, createEditingFormTemplate(obj), `afterend`);

  // place.parentElement.style.display = 'none';
};

const funcRemove = () => {
  const arr = tripEvents.querySelector(`form[class = "trip-events__item  event  event--edit"]`);
  arr.remove();
};

let counteri = 1;

const buttons = document.querySelectorAll(`.event__rollup-btn`);
for (let i = 0; i < buttons.length; i++) {

  buttons[i].addEventListener(`click`, function (evt) {

    counteri += 1;
    if (counteri % 2 === 0) {
      funcAdd(evt, i, buttons[i]);
    } else {
      funcRemove();
    }
  });
}

render(tripMain, createAboutRouteTemplate(routeOfCities, week), `afterbegin`); // a1
const tripInfo = tripMain.querySelector(`.trip-info`); // a2
render(tripInfo, createCostOfTripTemplate(totalCosts), `beforeend`); // a3
