import RouteComponent from '../components/route.js';
import CostComponent from '../components/cost.js';
import NoPointsComponent from '../components/no-points.js';
import ListOfDaysComponent, {generateDays} from '../components/list-trips.js';
import {render, RenderPosition, replace} from '../utils/render.js';
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
    this._filterController = null;

    this._listDays = null;
    this._creatingPoint = null;

    this._dataAboutDestinations = null;
    this._dataAboutOffers = null;

    this._totalCosts = null;
    this._routeOfCities = null;
    this._header = null;

    this._routeComponent = null;
    this._costComponent = null;
  }

  hide() {
    this._sortController.throwSort();
    this._pointsModel.activeSortType = SortType.EVENT;
    this._onSortChange();
    this._filterController.throwFilter();
    this._pointsModel.activeFilterType = FilterType.EVERYTHING;
    this._handlerFilter();

    this._container.hide();
  }

  show() {
    this._container.show();
  }

  render(totalCosts, routeOfCities, header) {
    this._totalCosts = totalCosts;
    this._routeOfCities = routeOfCities;
    this._header = header;

    if (!this._filterController) { // !!!!
      this._filterController = filterController;
      this._filterController.render();
    }

    const fullDataPoints = this._pointsModel.getPoints();
    this._dataAboutDestinations = this._pointsModel.getDataAboutDestinations();
    this._dataAboutOffers = this._pointsModel.getDataAboutOffers();

    const oldRouteComponent = this._routeComponent;
    this._routeComponent = new RouteComponent(this._routeOfCities, fullDataPoints);
    if (oldRouteComponent) {
      replace(this._routeComponent, oldRouteComponent);
    } else {
      render(this._header, this._routeComponent, RenderPosition.AFTERBEGIN);
    }

    const oldCostComponent = this._costComponent;
    this._costComponent = new CostComponent(this._totalCosts);
    if (oldCostComponent) {
      replace(this._costComponent, oldCostComponent);
    } else {
      render(this._header, this._costComponent, RenderPosition.BEFOREEND);
    }

    const isAllPointsAbsence = fullDataPoints.length === 0;

    if (isAllPointsAbsence) {
      render(this._container.getElement(), noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._sortController = new SortController(this._container.getElement(),
        pointsModel, this._filterController); // !!!!
    this._sortController.render();

    this._renderPoints(fullDataPoints, this._dataAboutDestinations, this._dataAboutOffers);
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }
    buttonEvent.setAttribute(`disabled`, `disabled`);
    this._filterController.throwFilter();
    this._pointsModel.activeFilterType = FilterType.EVERYTHING;

    if (this._pointsModel.getPoints().length === 0) {
      const tripMarkup = document.querySelector(`.trip-events`);
      tripMarkup.innerHTML = ``;
      this._sortController = new SortController(this._container.getElement(),
          pointsModel, this._filterController);
      this._sortController.render();
      render(this._container.getElement(), new ListOfDaysComponent(this._pointsModel.getPoints()),
          RenderPosition.BEFOREEND);
    } else {
      this._sortController.throwSort();
      this._pointsModel.activeSortType = SortType.EVENT;
      this._onSortChange();

      this._handlerFilter();
    }

    const tripListElement = this._container.getElement().querySelector(`.trip-days`);
    tripListElement.insertAdjacentHTML(`afterbegin`, generateDays(new Date(), -1));
    tripListElement.querySelector(`.day__counter`).textContent = ``;
    tripListElement.querySelector(`.day__date`).textContent = ``;
    const parentAdd = tripListElement.querySelector(`.trip-days__item`);
    this._creatingPoint = new PointController(parentAdd,
        this._onDataChange, this._onViewChange,
        this._dataAboutDestinations, this._dataAboutOffers);
    this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);
  }

  _renderPoints(points, dataAboutDestinations, dataAboutOffers) {
    render(this._container.getElement(), new ListOfDaysComponent(points), RenderPosition.BEFOREEND);
    this._listDays = this._container.getElement().querySelectorAll(`.trip-events__list`);

    for (let x = 0; x < points.length; x++) {
      const newPoints = renderPoints(this._listDays[x], points[x],
          this._onDataChange, this._onViewChange, dataAboutDestinations, dataAboutOffers);
      this._showedPointControllers = this._showedPointControllers.concat(newPoints);
    }
  }

  _removePoints() {
    this._showedPointControllers.forEach((pointController) => pointController.destroy());
    this._showedPointControllers = [];
    const days = this._container.getElement().querySelectorAll(`.trip-days__item`);
    days.forEach((day) => {
      day.remove();
    });
    this._container.getElement().querySelector(`.trip-days`).remove();
  }

  _updatePoints() {
    this._removePoints();
    this._renderPoints(this._pointsModel.getPoints(), this._dataAboutDestinations, this._dataAboutOffers);
    if (this._pointsModel.activeSortType !== `event`) {
      const parentList = this._container.getElement().querySelector(`.trip-days`);
      parentList.querySelector(`.day__counter`).textContent = ``;
      parentList.querySelector(`.day__date`).textContent = ``;
    }
  }

  _onSortChange() {
    this._updatePoints();
  }


  _updateTrip() {
    const tripMarkup = document.querySelector(`.trip-events`);
    tripMarkup.innerHTML = ``;
    // this._sortController.remove(); //?????? tripController
    this.render([1, 5, 6, 8, 1, 3], new Set(["апельсин", "яблоко", "банан"]), this._header);
  }

  _onDataChange(pointController, oldPoint, newPoint) {
    if (oldPoint === EmptyPoint) {
      this._creatingPoint = null;
      buttonEvent.removeAttribute(`disabled`);

      if (newPoint === null) {
        pointController.destroy();
        this._updatePoints();
      } else {
        this._api.createPoint(newPoint)
          .then((pointModel) => {
            this._pointsModel.addPoint(pointModel);
            pointController.render(pointModel, PointControllerMode.DEFAULT);
            this._updateTrip();
          })
          .catch(() => {
            pointController.shake();
          });
      }
      this._showedPointControllers = [].concat(pointController, this._showedPointControllers);
    } else if (newPoint === null) {
      this._api.deletePoint(oldPoint.id)
        .then(() => {
          this._pointsModel.removePoint(oldPoint.id);
          // this._updatePoints();
          this._updateTrip();
        })
        .catch(() => {
          pointController.shake();
        });
    } else {
      this._api.updatePoint(oldPoint.id, newPoint)
        .then((pointModel) => {
          const isSuccess = this._pointsModel.updatePoint(oldPoint.id, pointModel);
          if (isSuccess) {
            pointController.render(pointModel, PointControllerMode.DEFAULT);
            // this._updatePoints();
            this._updateTrip();
          }
        })

        .catch(() => {
          pointController.shake();
        });
    }
  }

  _onViewChange() {
    this._showedPointControllers.forEach((it) => it.setDefaultView());
  }

  _handlerFilter() {
    const filteredPoints = this._pointsModel.getPoints();
    const parentList = this._container.getElement().querySelector(`.trip-days`);
    this._removePoints();
    parentList.remove();
    this._renderPoints(filteredPoints, this._dataAboutDestinations, this._dataAboutOffers);

    this._sortController.throwDateOnTimeAndPrice();
  }
}
