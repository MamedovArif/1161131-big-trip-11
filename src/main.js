import RouteComponent from './components/route.js';
import CostComponent from './components/cost.js';
import MenuComponent from './components/menu.js';
import FilterComponent from './components/filters.js';
import SortComponent from './components/sort.js';
import NoPointsComponent from './components/no-points.js';
import FormForEditComponent from './components/editing-form.js';
import SortComponent from './components/sort.js';
import {generateDays} from './components/list-trips.js';
import ListOfDaysComponent from './components/list-trips.js';
import {generatePoints, defaultData} from './mock/route-point.js';
import {generateDate} from './mock/list-trips.js';
import {render, RenderPosition} from './utils.js';
import {renderPoint} from './components/render-point.js';

const NUMBER_OF_STOPS = 2;
const QUANTITY_OF_DAYS = 4;

const tripMain = document.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);

export const tripEvents = document.querySelector(`.trip-events`);

render(tripControls.children[0], new MenuComponent().getElement(), RenderPosition.AFTEREND);
render(tripControls, new FilterComponent().getElement(), RenderPosition.BEFOREEND);

render(tripEvents, new SortComponent().getElement(), RenderPosition.BEFOREEND);

const sortForm = tripEvents.querySelector(`.trip-events__trip-sort`);

const createDefaultForm = () => {
  render(sortForm, new FormForEditComponent(defaultData).getElement(), RenderPosition.AFTEREND);
  buttonEvent.removeEventListener(`click`, createDefaultForm);
  const buttonSave = tripEvents.querySelector(`.event__save-btn`);
  buttonSave.addEventListener(`click`, function () {
    tripEvents.querySelector(`form[class = "trip-events__item  event  event--edit"]`).remove();
    buttonEvent.addEventListener(`click`, createDefaultForm);
  });
};


const buttonEvent = tripMain.querySelector(`.btn`);
buttonEvent.addEventListener(`click`, createDefaultForm);

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

const renderMain = () => {
  const isAllPointsAbsence = NUMBER_OF_STOPS === 0;

  if (isAllPointsAbsence) {
    render(tripEvents,
        noPointsComponent.getElement(), RenderPosition.BEFOREEND);
    return;
  }

  render(tripEvents, new SortComponent().getElement(), RenderPosition.BEFOREEND);

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

  for (let j = 0; j < listDays.length; j++) {
    const points = generatePoints(NUMBER_OF_STOPS, week[j].date);
    points.sort((a, b) => {
      return a.timeBegin - b.timeBegin;
    });

    for (let i = 0; i < points.length; i++) {
      totalCosts.push(points[i].price);
      routeOfCities.add(points[i].city);
      renderPoint(listDays[j], points[i]);
    }
  }

  render(tripMain, new RouteComponent(routeOfCities, week).getElement(), RenderPosition.AFTERBEGIN); // a1
  const tripInfo = tripMain.querySelector(`.trip-info`); // a2
  render(tripInfo, new CostComponent(totalCosts).getElement(), RenderPosition.BEFOREEND); // a3
};
renderMain();
