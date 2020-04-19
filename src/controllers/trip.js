import RouteComponent from '../components/route.js';
import CostComponent from '../components/cost.js';
import SortComponent from '../components/sort.js';
import NoPointsComponent from '../components/no-points.js';
import FormForEditComponent from '../components/editing-form.js';
import ListOfDaysComponent from '../components/list-trips.js';
// import {defaultData} from '../mock/route-point.js';
import PointOfRouteComponent from '../components/route-point.js';
import {render, RenderPosition, replace} from '../utils/render.js'; // , remove
import {generateDays} from '../components/list-trips.js';

/*
const createDefaultForm = (button, container) => {
  remove(noPointsComponent);

  const defaultFormComponent = new FormForEditComponent(defaultData);
  render(container, defaultFormComponent, RenderPosition.AFTERBEGIN);
  button.removeEventListener(`click`, createDefaultForm.bind(null,
      button, container));
  defaultFormComponent.setSubmitHandler(function () {
    remove(defaultFormComponent);
    button.addEventListener(`click`, createDefaultForm.bind(null,
        button, container));
  });
};
*/
const noPointsComponent = new NoPointsComponent();


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

export default class TripController {
  constructor(container) {
    this._container = container;
    this._sortComponent = new SortComponent();
  }

  render(week, allPoints, totalCosts, routeOfCities, header) {
    const isAllPointsAbsence = allPoints.length === 0;

    if (isAllPointsAbsence) {
      render(this._container, noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);

    const days = week.map((item, counter) => {
      return generateDays(item, counter);
    });
    render(this._container, new ListOfDaysComponent(days), RenderPosition.BEFOREEND);
    const listDays = this._container.querySelectorAll(`.trip-events__list`);

    for (let x = 0; x < allPoints.length; x++) {
      let points = allPoints[x];
      for (let y = 0; y < points.length; y++) {
        renderPoint(listDays[x], points[y]);
      }
    }
    render(header, new RouteComponent(routeOfCities, week), RenderPosition.AFTERBEGIN); // a1
    const tripInfo = header.querySelector(`.trip-info`); // a2
    render(tripInfo, new CostComponent(totalCosts), RenderPosition.BEFOREEND); // a3
  }
}
