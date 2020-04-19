import RouteComponent from '../components/route.js';
import CostComponent from '../components/cost.js';
import SortComponent from '../components/sort.js';
import NoPointsComponent from '../components/no-points.js';
import FormForEditComponent from '../components/editing-form.js';
import ListOfDaysComponent from '../components/list-trips.js';
import {generatePoints, defaultData} from '../mock/route-point.js';
import PointOfRouteComponent from '../components/route-point.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {generateDays} from '../components/list-trips.js';

const tripEvents = document.querySelector(`.trip-events`);
const tripMain = document.querySelector(`.trip-main`);

const createDefaultForm = () => {
  remove(noPointsComponent);

  const defaultFormComponent = new FormForEditComponent(defaultData);
  render(tripEvents, defaultFormComponent, RenderPosition.AFTERBEGIN);
  buttonEvent.removeEventListener(`click`, createDefaultForm);
  defaultFormComponent.setSubmitHandler(function () {
    remove(defaultFormComponent);
    buttonEvent.addEventListener(`click`, createDefaultForm);
  });
};

const noPointsComponent = new NoPointsComponent();
const buttonEvent = tripMain.querySelector(`.btn`);
buttonEvent.addEventListener(`click`, createDefaultForm);


const renderPoint = (place, dataOfRoute) => {
  const replacePointToForm = () => {
    replace(formForEditComponent, pointOfRouteComponent);
  };

  const replaceFormToPoint = () => {
    replace(pointOfRouteComponent, formForEditComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const pointOfRouteComponent = new PointOfRouteComponent(dataOfRoute);
  pointOfRouteComponent.setClickHandler(() => {
    replacePointToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const formForEditComponent = new FormForEditComponent(dataOfRoute);
  formForEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(place, pointOfRouteComponent, RenderPosition.BEFOREEND);
};

const renderMain = (week, allPoints, totalCosts, routeOfCities) => {
  const isAllPointsAbsence = allPoints.length === 0;

  if (isAllPointsAbsence) {
    render(tripEvents,
        noPointsComponent, RenderPosition.BEFOREEND);
    return;
  }

  render(tripEvents, new SortComponent(), RenderPosition.BEFOREEND);


  const days = week.map((item, counter) => {
    return generateDays(item, counter);
  });
  render(tripEvents, new ListOfDaysComponent(days), RenderPosition.BEFOREEND);
  const listDays = tripEvents.querySelectorAll(`.trip-events__list`);

  for (let x = 0; x < allPoints.length; x++) {
    let points = allPoints[x];
    for (let y = 0; y < points.length; y++) {
      renderPoint(listDays[x], points[y]);
    }
  }
  render(tripMain, new RouteComponent(routeOfCities, week), RenderPosition.AFTERBEGIN); // a1
  const tripInfo = tripMain.querySelector(`.trip-info`); // a2
  render(tripInfo, new CostComponent(totalCosts), RenderPosition.BEFOREEND); // a3
};

export default class TripController {
  constructor() {
    this._container = 'container';
  }

  render(week, allDataPoints, totalCosts, routeOfCities) {
    renderMain(week, allDataPoints, totalCosts, routeOfCities);
  }
}
