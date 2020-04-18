import RouteComponent from './components/route.js';
import CostComponent from './components/cost.js';
import MenuComponent from './components/menu.js';
import FilterComponent from './components/filters.js';
import SortComponent from './components/sort.js';
import NoPointsComponent from './components/no-points.js';
import FormForEditComponent from './components/editing-form.js';
import {generateDays} from './components/list-trips.js';
import ListOfDaysComponent from './components/list-trips.js';
import {generatePoints, defaultData} from './mock/route-point.js';
import {generateDate} from './mock/list-trips.js';
import {render, RenderPosition} from './utils/render.js';
//import {renderPoint} from './components/render-point.js';

//import FormForEditComponent from './editing-form.js';
import PointOfRouteComponent from './components/route-point.js';
//import {render, RenderPosition} from '../utils/render.js';

const NUMBER_OF_STOPS = 2;
const QUANTITY_OF_DAYS = 4;

const tripMain = document.querySelector(`.trip-main`);
const tripControls = tripMain.querySelector(`.trip-controls`);

export const tripEvents = document.querySelector(`.trip-events`);

render(tripControls.children[0], new MenuComponent(), RenderPosition.AFTEREND);
render(tripControls, new FilterComponent(), RenderPosition.BEFOREEND);

const createDefaultForm = () => {
  noPointsComponent.getElement().remove();
  noPointsComponent.removeElement();

  const defaultForm = new FormForEditComponent(defaultData);
  render(tripEvents, defaultForm, RenderPosition.AFTERBEGIN);
  buttonEvent.removeEventListener(`click`, createDefaultForm);
  defaultForm.getElement().addEventListener(`submit`, function () {
    defaultForm.getElement().remove();
    defaultForm.removeElement();
    buttonEvent.addEventListener(`click`, createDefaultForm);
  });
};

const buttonEvent = tripMain.querySelector(`.btn`);
buttonEvent.addEventListener(`click`, createDefaultForm);

const noPointsComponent = new NoPointsComponent();

const renderPoint = (place, dataOfRoute) => {

  const replacePointToForm = () => {
    place.replaceChild(editForm, elementOfPointOfRoute);
  };

  const replaceFormToPoint = () => {
    place.replaceChild(elementOfPointOfRoute, editForm);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const pointOfRouteComponent = new PointOfRouteComponent(dataOfRoute);
  const elementOfPointOfRoute = pointOfRouteComponent.getElement();
  const arrowButton = elementOfPointOfRoute.querySelector(`.event__rollup-btn`);
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

  render(place, pointOfRouteComponent, RenderPosition.BEFOREEND);
};

const renderMain = () => {
  const isAllPointsAbsence = NUMBER_OF_STOPS === 0;

  if (isAllPointsAbsence) {
    render(tripEvents,
        noPointsComponent, RenderPosition.BEFOREEND);
    return;
  }

  render(tripEvents, new SortComponent(), RenderPosition.BEFOREEND);

  const week = [];
  for (let y = 0; y < QUANTITY_OF_DAYS; y++) {
    week.push(generateDate());
  }
  week.sort((a, b) => a.date - b.date);

  const days = week.map((item, counter) => {
    return generateDays(item, counter);
  });

  render(tripEvents, new ListOfDaysComponent(days), RenderPosition.BEFOREEND);

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

  render(tripMain, new RouteComponent(routeOfCities, week), RenderPosition.AFTERBEGIN); // a1
  const tripInfo = tripMain.querySelector(`.trip-info`); // a2
  render(tripInfo, new CostComponent(totalCosts), RenderPosition.BEFOREEND); // a3
};

renderMain();
