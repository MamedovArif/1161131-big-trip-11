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

const renderPoint = (place, dataOfRoute) => {

  const replacePointToForm = () => {
    place.replaceChild(formForEditComponent.getElement(),
        pointOfRouteComponent.getElement());
  };

  const replaceFormToPoint = () => {
    place.replaceChild(pointOfRouteComponent.getElement(),
        formForEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const pointOfRouteComponent = new PointOfRouteComponent(dataOfRoute);
  const arrowButton = pointOfRouteComponent.getElement().querySelector(`.event__rollup-btn`);
  arrowButton.addEventListener(`click`, () => {
    replacePointToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const formForEditComponent = new FormForEditComponent(dataOfRoute);
  const editForm = formForEditComponent.getElement();
  editForm.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(place, pointOfRouteComponent.getElement(), RenderPosition.BEFOREEND);
};

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
    renderPoint(listDays[j], points[i]);
  }
}


render(tripMain, new RouteComponent(routeOfCities, week).getElement(), RenderPosition.AFTERBEGIN); // a1
const tripInfo = tripMain.querySelector(`.trip-info`); // a2
render(tripInfo, new CostComponent(totalCosts).getElement(), RenderPosition.BEFOREEND); // a3
