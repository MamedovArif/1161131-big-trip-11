import RouteComponent from '../components/route.js';
import CostComponent from '../components/cost.js';
import SortComponent from '../components/sort.js';
import NoPointsComponent from '../components/no-points.js';
import FormForEditComponent from '../components/editing-form.js';
import ListOfDaysComponent, {generateDays} from '../components/list-trips.js';
import {defaultData} from '../mock/route-point.js';
import PointOfRouteComponent from '../components/route-point.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {filterComponent} from '../main.js';
import {FilterType} from '../components/filters.js';

export const createDefaultForm = (button, container) => {
  remove(noPointsComponent);

  const defaultFormComponent = new FormForEditComponent(defaultData);
  render(container, defaultFormComponent, RenderPosition.AFTERBEGIN);
  button.removeEventListener(`click`, createDefaultForm);
  defaultFormComponent.setSubmitHandler(function () {
    remove(defaultFormComponent);
    button.addEventListener(`click`, createDefaultForm);
  });
};

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

const getFilteredPoints = (points, filterType) => {
  let dataOfPoints;
  let filteredPoints = [];
  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < points[i].length; j++) {
      filteredPoints.push(points[i][j]);
    }
  }

  switch (filterType) {
    case FilterType.FUTURE:
      dataOfPoints = filteredPoints.filter((item) => item.timeBegin > new Date());
      break;
    case FilterType.PAST:
      dataOfPoints = filteredPoints.filter((item) => item.timeBegin < new Date());
      break;
    case FilterType.EVERYTHING:
      dataOfPoints = filteredPoints;
      break;
    default:
      throw new Error(`функция getFilteredPoints принимает неверные аргументы`);
  }
  return dataOfPoints;
};

export default class TripController {
  constructor(container) {
    this._container = container;
    this._sortComponent = new SortComponent();
  }

  render(datesOfTravel, allPoints, totalCosts, routeOfCities, header) {
    const isAllPointsAbsence = allPoints.length === 0;

    if (isAllPointsAbsence) {
      render(this._container, noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);

    const days = datesOfTravel.map((item, counter) => {
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
    render(header, new RouteComponent(routeOfCities, datesOfTravel), RenderPosition.AFTERBEGIN); // a1
    const tripInfo = header.querySelector(`.trip-info`); // a2
    render(tripInfo, new CostComponent(totalCosts), RenderPosition.BEFOREEND); // a3


    filterComponent.setFilterTypeChangeHandler((filterType) => {
      const filteredPoints = getFilteredPoints(allPoints, filterType);
      const parentList = this._container.querySelector(`.trip-days`);
      parentList.innerHTML = ``;
      //  выравниваем
      if (filterType !== FilterType.EVERYTHING) {
        parentList.insertAdjacentHTML(`beforeend`, generateDays({date: new Date()}, 0)); // *
        parentList.querySelector(`.day__counter`).textContent = ``; // *
        parentList.querySelector(`.day__date`).textContent = ``; // *

        for (let x = 0; x < filteredPoints.length; x++) {
          let point = filteredPoints[x];
          // renderPoint(this._container.querySelector(`.trip-days`), point); предыдущий вариант
          renderPoint(this._container.querySelector(`.trip-events__list`), point); // выравниваем
        }
      } else {
        render(this._container, new ListOfDaysComponent(days), RenderPosition.BEFOREEND);
        let listOfDays = this._container.querySelectorAll(`.trip-events__list`); // *
        for (let x = 0; x < allPoints.length; x++) {
          let points = allPoints[x];
          for (let y = 0; y < points.length; y++) {
            renderPoint(listOfDays[x], points[y]);
          }
        }
      }
    });
  }
}

