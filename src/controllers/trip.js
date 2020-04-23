import RouteComponent from '../components/route.js';
import CostComponent from '../components/cost.js';
import SortComponent from '../components/sort.js';
import NoPointsComponent from '../components/no-points.js';
import FormForEditComponent from '../components/editing-form.js';
import ListOfDaysComponent, {generateDays} from '../components/list-trips.js';
import {defaultData} from '../mock/route-point.js';

import {render, RenderPosition, remove} from '../utils/render.js';
import {filterComponent} from '../main.js';
import {FilterType} from '../components/filters.js';
import PointController from './point.js';

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

const renderPoints = (parent, points) => {
  return points.map((point) => {
    const pointController = new PointController(parent, onDataChange);
    pointController.render(point);
    return pointController;
  })
}

export default class TripController {
  constructor(container) {
    this._container = container;
    this._allPoints = [];
    this._showedPointControllers = [];

    this._sortComponent = new SortComponent();
    this._handlerFilter = this._handlerFilter.bind(this);
    this._pointController = null;
    this._days = null;
    filterComponent.setFilterTypeChangeHandler(this._handlerFilter);
  }

  render(datesOfTravel, allPoints, totalCosts, routeOfCities, header) {
    this._allPoints = allPoints;
    const isAllPointsAbsence = this._allPoints.length === 0;

    if (isAllPointsAbsence) {
      render(this._container, noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(this._container, this._sortComponent, RenderPosition.BEFOREEND);

    this._days = datesOfTravel.map((item, counter) => {
      return generateDays(item, counter);
    });


    render(this._container, new ListOfDaysComponent(this._days), RenderPosition.BEFOREEND);
    const listDays = this._container.querySelectorAll(`.trip-events__list`);

    for (let x = 0; x < this._allPoints.length; x++) {
      const newPoints = renderPoints(listDays[x], this._allPoints[x]);
      this._showedPointControllers = this._showedPointControllers.concat(newPoints);
    }

    render(header, new RouteComponent(routeOfCities, datesOfTravel), RenderPosition.AFTERBEGIN); // a1
    const tripInfo = header.querySelector(`.trip-info`); // a2
    render(tripInfo, new CostComponent(totalCosts), RenderPosition.BEFOREEND); // a3
  }

  _onDataChange(pointController, oldPoint, newPoint) {
    let points = [];
    this._allPoints.map((item) => {
      points = points.concat(item);
    });
    const index = points.findIndex((point) => point === oldPoint);
    if (index === -1) {
      return;
    }
    points = [].concat(points.slice(0, index), newData, points.slice(index + 1));

    pointController.render(points[index]);
  }

  _handlerFilter(filterType) {
    const filteredPoints = getFilteredPoints(this._allPoints, filterType);
    const parentList = this._container.querySelector(`.trip-days`);
    parentList.innerHTML = ``;
    //  выравниваем
    if (filterType !== FilterType.EVERYTHING) {
      parentList.insertAdjacentHTML(`beforeend`, generateDays({date: new Date()}, 0)); // *
      parentList.querySelector(`.day__counter`).textContent = ``; // *
      parentList.querySelector(`.day__date`).textContent = ``; // *

      const newPoints = renderPoints(this._container.querySelector(`.trip-events__list`), filteredPoints);
      this._showedPointControllers = newPoints;
    } else {
      render(this._container, new ListOfDaysComponent(this._days), RenderPosition.BEFOREEND);
      let listOfDays = this._container.querySelectorAll(`.trip-events__list`); // *
      this._showedPointControllers = [];
      for (let x = 0; x < this._allPoints.length; x++) {
        const newPoint = renderPoints(listOfDays[x], this._allPoints[x]);
        this._showedPointControllers = this._showedPointControllers.concat(newPoint); ///!!!
      }
    }
  }
}
