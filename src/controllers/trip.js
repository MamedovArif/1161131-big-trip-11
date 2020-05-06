import RouteComponent from '../components/route.js';
import CostComponent from '../components/cost.js';
import NoPointsComponent from '../components/no-points.js';
import ListOfDaysComponent, {generateDays} from '../components/list-trips.js';

import {render, RenderPosition} from '../utils/render.js';
import {filterComponent} from '../main.js';
import {FilterType} from '../components/filters.js';
import PointController, {Mode as PointControllerMode, EmptyPoint} from './point.js';
import SortController from './sort.js';
import {pointsModel} from '../main.js';

const noPointsComponent = new NoPointsComponent();

const getFilteredPoints = (points, filterType) => {
  let dataOfPoints;

  switch (filterType) {
    case FilterType.FUTURE:
      dataOfPoints = points.map((littleArray) => {
        return littleArray.filter((item) => item.timeBegin > new Date());
      });
      dataOfPoints = dataOfPoints.filter((littleArray) => {
        return littleArray.length !== 0;
      });
      break;
    case FilterType.PAST:
      dataOfPoints = points.map((littleArray) => {
        return littleArray.filter((item) => item.timeBegin < new Date());
      });
      dataOfPoints = dataOfPoints.filter((littleArray) => {
        return littleArray.length !== 0;
      });
      break;
    case FilterType.EVERYTHING:
      dataOfPoints = points;
      break;
    default:
      throw new Error(`функция getFilteredPoints принимает неверные аргументы`);
  }
  return dataOfPoints;
};

const renderPoints = (parent, points, onDataChange, onViewChange) => {
  return points.map((point) => {
    const pointController = new PointController(parent, onDataChange, onViewChange);
    pointController.render(point, PointControllerMode.DEFAULT);
    return pointController;
  });
};

export default class TripController {
  constructor(container, model) {
    this._container = container;
    this._showedPointControllers = [];
    this._pointsModel = model;

    this._handlerFilter = this._handlerFilter.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortChange = this._onSortChange.bind(this);
    this._pointController = null;

    filterComponent.setFilterTypeChangeHandler(this._handlerFilter);
    this._pointsModel.setSortChangeHandler(this._onSortChange);

    this._sortController = null;

    this._listDays = null;
    this._creatingPoint = null;
  }

  render(totalCosts, routeOfCities, header) {
    const fullDataPoints = this._pointsModel.getPoints();
    const isAllPointsAbsence = fullDataPoints.length === 0;

    if (isAllPointsAbsence) {
      render(this._container, noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._sortController = new SortController(this._container, pointsModel);
    this._sortController.render();

    this._renderPoints(fullDataPoints);

    render(header, new RouteComponent(routeOfCities, fullDataPoints), RenderPosition.AFTERBEGIN); // a1
    const tripInfo = header.querySelector(`.trip-info`); // a2
    render(tripInfo, new CostComponent(totalCosts), RenderPosition.BEFOREEND); // a3
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }
    const tripListElement = this._container.querySelector(`.trip-days`);
    tripListElement.insertAdjacentHTML(`afterbegin`, generateDays(new Date(), -1));
    const parentAdd = tripListElement.querySelector(`.trip-days__item`);
    this._creatingPoint = new PointController(parentAdd,
        this._onDataChange, this._onViewChange);
    this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);
  }

  _renderPoints(points) {
    render(this._container, new ListOfDaysComponent(points), RenderPosition.BEFOREEND);
    this._listDays = this._container.querySelectorAll(`.trip-events__list`);

    for (let x = 0; x < points.length; x++) {
      const newPoints = renderPoints(this._listDays[x], points[x],
          this._onDataChange, this._onViewChange);
      this._showedPointControllers = this._showedPointControllers.concat(newPoints);
    }
  }

  _removePoints() {
    this._showedPointControllers.forEach((pointController) => pointController.destroy());
    this._showedPointControllers = [];
    const days = this._container.querySelectorAll(`.trip-days__item`);
    days.forEach((day) => {
      day.remove();
    });
  }

  _updatePoints() {
    this._removePoints();
    if (this._pointsModel._activeSortType !== `event`) {
      const parentList = this._container.querySelector(`.trip-days`);
      parentList.insertAdjacentHTML(`beforeend`, generateDays(new Date(), 0));
      parentList.querySelector(`.day__counter`).textContent = ``;
      parentList.querySelector(`.day__date`).textContent = ``;

      renderPoints(this._container.querySelector(`.trip-events__list`),
          this._pointsModel.getPoints(), this._onDataChange, this._onViewChange);
    } else {
      const fullDataPoints = this._pointsModel.getPoints();
      this._renderPoints(fullDataPoints);
    }
  }

  _onSortChange() {
    this._updatePoints();
  }

  _onDataChange(pointController, oldPoint, newPoint) {
    if (oldPoint === EmptyPoint) {
      this._creatingPoint = null; // открыта ли какая-тa задача
      if (newPoint === null) {
        pointController.destroy();
        this._updatePoints();
      } else {
        this._pointsModel.addPoint(newPoint);
        pointController.render(newPoint, PointControllerMode.DEFAULT);
      }
      this._showedPointControllers = [].concat(pointController, this._showedPointControllers);
    } else if (newPoint === null) {
      this._pointsModel.removePoint(oldPoint.id);
      this._updatePoints();
    } else {
      const isSuccess = this._pointsModel.updatePoint(oldPoint.id, newPoint);
      if (isSuccess) {
        pointController.render(newPoint, PointControllerMode.DEFAULT);
      }
    }
  }

  _onViewChange() {
    this._showedPointControllers.forEach((it) => it.setDefaultView());
  }

  _handlerFilter(filterType) {
    this._sortController._activeSortType = `event`;
    this._sortController.render();
    const fullDataPoints = this._pointsModel.getPoints();
    const filteredPoints = getFilteredPoints(fullDataPoints, filterType);
    const parentList = this._container.querySelector(`.trip-days`);
    this._removePoints(); // parentList.innerHTML = ``;
    parentList.remove();
    //  выравниваем
    if (filterType !== FilterType.EVERYTHING) {
      this._renderPoints(filteredPoints);
    } else {
      this._renderPoints(fullDataPoints);
    }
  }
}
