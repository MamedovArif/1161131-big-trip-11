import RouteComponent from './components/route.js';
import CostComponent from './components/cost.js';
import MenuComponent from './components/menu.js';
import FilterComponent from './components/filters.js';
import SortComponent from './components/sort.js';
import FormForEditComponent from './components/editing-form.js';
import PointOfRouteComponent from './components/route-point.js';
import {generateDays} from './components/list-trips.js';
import ListOfDaysComponent from './components/list-trips.js';

import {generatePoints, defaultData} from './mock/route-point.js';
import {generateDate} from './mock/list-trips.js';
import {render, RenderPosition} from './utils.js';

const NUMBER_OF_STOPS = 3;
const QUANTITY_OF_DAYS = 4;

const tripMain = document.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);

const tripEvents = document.querySelector(`.trip-events`);

render(tripControls.children[0], new MenuComponent().getElement(), RenderPosition.AFTEREND);
render(tripControls, new FilterComponent().getElement(), RenderPosition.BEFOREEND);

render(tripEvents, new SortComponent().getElement(), RenderPosition.BEFOREEND); // b1

const sortForm = tripEvents.querySelector(`.trip-events__trip-sort`);

const createForm = () => {
  render(sortForm, new FormForEditComponent(defaultData).getElement(), RenderPosition.AFTEREND); // b2
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

render(tripEvents, new ListOfDaysComponent(days).getElement(), RenderPosition.BEFOREEND);


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
    render(listDays[j], new PointOfRouteComponent(points[i]).getElement(), RenderPosition.BEFOREEND);
    render(listDays[j], new FormForEditComponent(points[i]).getElement(), RenderPosition.BEFOREEND);
  }
}

const funcAdd = (evt, index, place) => {
  evt.preventDefault();
  const obj = globalArray[index];
  render(place.parentElement.parentElement,
      new FormForEditComponent(obj).getElement(), RenderPosition.AFTEREND);

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

render(tripMain, new RouteComponent(routeOfCities, week).getElement(), RenderPosition.AFTERBEGIN); // a1
const tripInfo = tripMain.querySelector(`.trip-info`); // a2
render(tripInfo, new CostComponent(totalCosts).getElement(), RenderPosition.BEFOREEND); // a3
