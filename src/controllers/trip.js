import RouteComponent from '../components/route.js';
import CostComponent from '../components/cost.js';
import NoPointsComponent from '../components/no-points.js';
import ListOfDaysComponent, {generateDays} from '../components/list-trips.js';
import {render, RenderPosition} from '../utils/render.js';
import {filterController} from '../main.js';
import PointController, {Mode as PointControllerMode, EmptyPoint} from './point.js';
import SortController from './sort.js';
import {pointsModel, buttonEvent} from '../main.js';
import {SortType, FilterType} from "../const.js";

const noPointsComponent = new NoPointsComponent();

const renderPoints = (parent, points, onDataChange, onViewChange, dataAboutDestinations, dataAboutOffers) => {
  return points.map((point) => {
    const pointController = new PointController(parent, onDataChange,
      onViewChange, dataAboutDestinations, dataAboutOffers);
    pointController.render(point, PointControllerMode.DEFAULT);
    return pointController;
  });
};

export default class TripController {
  constructor(container, model, api) {
    this._container = container;
    this._showedPointControllers = [];
    this._pointsModel = model;
    this._api = api;

    this._handlerFilter = this._handlerFilter.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortChange = this._onSortChange.bind(this);
    this._pointController = null;

    this._pointsModel.setFilterChangeHandler(this._handlerFilter);
    this._pointsModel.setSortChangeHandler(this._onSortChange);

    this._sortController = null;
    this._filterController = filterController;

    this._listDays = null;
    this._creatingPoint = null;

    this._dataAboutDestinations = null;
    this._dataAboutOffers = null;
  }

  render(totalCosts, routeOfCities, header) {
    this._filterController.render();

    const fullDataPoints = this._pointsModel.getPoints();
    this._dataAboutDestinations = this._pointsModel.getDataAboutDestinations();
    this._dataAboutOffers = this._pointsModel.getDataAboutOffers();

    const isAllPointsAbsence = fullDataPoints.length === 0;
    if (isAllPointsAbsence) {
      render(this._container, noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._sortController = new SortController(this._container, pointsModel, this._filterController);
    this._sortController.render();

    this._renderPoints(fullDataPoints, this._dataAboutDestinations, this._dataAboutOffers); /////console.log(dataAboutDestinations);

    render(header, new RouteComponent(routeOfCities, fullDataPoints), RenderPosition.AFTERBEGIN); // a1
    const tripInfo = header.querySelector(`.trip-info`); // a2
    render(tripInfo, new CostComponent(totalCosts), RenderPosition.BEFOREEND); // a3
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }
    buttonEvent.setAttribute('disabled', 'disabled');
    //сбросить сортировку и фильтрацию
    this._sortController.throwSort();
    this._pointsModel._activeSortType = SortType.EVENT;
    this._onSortChange();
    this._filterController.throwFilter();
    this._pointsModel._activeFilterType = FilterType.EVERYTHING;
    this._handlerFilter();

    const tripListElement = this._container.querySelector(`.trip-days`);
    tripListElement.insertAdjacentHTML(`afterbegin`, generateDays(new Date(), -1));
    tripListElement.querySelector(`.day__counter`).textContent = ``;
    tripListElement.querySelector(`.day__date`).textContent = ``;
    const parentAdd = tripListElement.querySelector(`.trip-days__item`);
    this._creatingPoint = new PointController(parentAdd,
        this._onDataChange, this._onViewChange);
    this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);
  }

  _renderPoints(points, dataAboutDestinations, dataAboutOffers) {
    render(this._container, new ListOfDaysComponent(points), RenderPosition.BEFOREEND);
    this._listDays = this._container.querySelectorAll(`.trip-events__list`);

    for (let x = 0; x < points.length; x++) {
      const newPoints = renderPoints(this._listDays[x], points[x],
          this._onDataChange, this._onViewChange, dataAboutDestinations, dataAboutOffers);
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
    this._container.querySelector(`.trip-days`).remove(); // sin
  }

  _updatePoints() {
    this._removePoints();
    this._renderPoints(this._pointsModel.getPoints(), this._dataAboutDestinations, this._dataAboutOffers);
    if (this._pointsModel._activeSortType !== `event`) {
      const parentList = this._container.querySelector(`.trip-days`);
      parentList.querySelector(`.day__counter`).textContent = ``;
      parentList.querySelector(`.day__date`).textContent = ``; // sin
    }
  }

  _onSortChange() { // название не совсем корректное
    this._updatePoints();
  }

  _onDataChange(pointController, oldPoint, newPoint) {
    if (oldPoint === EmptyPoint) {
      this._creatingPoint = null; // обнуляем значение creatingPoint
      buttonEvent.removeAttribute('disabled');

      if (newPoint === null) {
        pointController.destroy();
        this._updatePoints();
      } else {
        this._pointsModel.addPoint(newPoint);  ////////////
        pointController.render(newPoint, PointControllerMode.DEFAULT);
      }
      this._showedPointControllers = [].concat(pointController, this._showedPointControllers);
    } else if (newPoint === null) {
      this._pointsModel.removePoint(oldPoint.id);
      this._updatePoints();
    } else {
      this._api.updatePoint(oldPoint.id, newPoint)
        .then((pointModel) => {
          const isSuccess = this._pointsModel.updatePoint(oldPoint.id, pointModel);
          if (isSuccess) {
            pointController.render(pointModel, PointControllerMode.DEFAULT);
          }
        })
    }
  }

  _onViewChange() {
    this._showedPointControllers.forEach((it) => it.setDefaultView());
  }

  _handlerFilter(filterType) {
    const filteredPoints = this._pointsModel.getPoints();
    const parentList = this._container.querySelector(`.trip-days`);
    this._removePoints();
    parentList.remove();
    this._renderPoints(filteredPoints, this._dataAboutDestinations, this._dataAboutOffers);

    this._sortController.throwDateOnTimeAndPrice();
  }
}
