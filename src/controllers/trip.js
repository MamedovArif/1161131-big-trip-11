import RouteComponent from '../components/route.js';
import CostComponent from '../components/cost.js';
import NoPointsComponent from '../components/no-points.js';
import FormForEditComponent from '../components/editing-form.js';
import ListOfDaysComponent, {generateDays} from '../components/list-trips.js';
import {defaultData} from '../mock/route-point.js';

import {render, RenderPosition, remove} from '../utils/render.js';
import {filterComponent} from '../main.js';
import {FilterType} from '../components/filters.js';
import PointController from './point.js';
import SortController from './sort.js';
import {pointsModel} from '../main.js';

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
  // let filteredPoints = [];
  // for (let i = 0; i < points.length; i++) {
  //   for (let j = 0; j < points[i].length; j++) {
  //     filteredPoints.push(points[i][j]);
  //   }
  // }

  switch (filterType) {
    case FilterType.FUTURE:
      //dataOfPoints = filteredPoints.filter((item) => item.timeBegin > new Date());
      dataOfPoints = points.map((littleArray) => {
        return littleArray.filter((item) => item.timeBegin > new Date());
      })
      break;
    case FilterType.PAST:
      dataOfPoints = filteredPoints.filter((item) => item.timeBegin < new Date());
      break;
    case FilterType.EVERYTHING:
      //dataOfPoints = filteredPoints;
      break;
    default:
      throw new Error(`функция getFilteredPoints принимает неверные аргументы`);
  }
  return dataOfPoints;
};

const renderPoints = (parent, points, onDataChange, onViewChange) => {
  console.log(parent);
  return points.map((point) => {
    const pointController = new PointController(parent, onDataChange, onViewChange);
    pointController.render(point);
    return pointController;
  });
};

export default class TripController {
  constructor(container, pointsModel) {
    this._container = container;
    this._showedPointControllers = [];
    this._pointsModel = pointsModel;

    this._handlerFilter = this._handlerFilter.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortChange = this._onSortChange.bind(this);
    this._pointController = null;
    this._days = null;

    filterComponent.setFilterTypeChangeHandler(this._handlerFilter);
    this._pointsModel.setSortChangeHandler(this._onSortChange);

    this._sortController = null;

    this._listDays = null; // !!
    //this._renderPoints = this._renderPoints.bind(this);
  }

  render(totalCosts, routeOfCities, header) {
    const fullDataPoints = this._pointsModel.getPoints(); fullDataPoints
    const isAllPointsAbsence = fullDataPoints.length === 0;

    if (isAllPointsAbsence) {
      render(this._container, noPointsComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._sortController = new SortController(this._container, pointsModel)
    this._sortController.render();


    // this._days = datesOfTravel.map((item, counter) => {
    //   return generateDays(item, counter);
    // });
    //render(this._container, new ListOfDaysComponent(this._days), RenderPosition.BEFOREEND);
    // this._listDays = this._container.querySelectorAll(`.trip-events__list`);

    // for (let x = 0; x < allPoints.length; x++) {
    //   const newPoints = renderPoints(this._listDays[x], allPoints[x],
    //       this._onDataChange, this._onViewChange);
    //   this._showedPointControllers = this._showedPointControllers.concat(newPoints);
    // }
    this._renderPoints(fullDataPoints);

    render(header, new RouteComponent(routeOfCities, fullDataPoints), RenderPosition.AFTERBEGIN); // a1
    const tripInfo = header.querySelector(`.trip-info`); // a2
    render(tripInfo, new CostComponent(totalCosts), RenderPosition.BEFOREEND); // a3
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
    })
  }

  _updatePoints() {
    this._removePoints();
    if (this._pointsModel._activeSortType !== `event`) {
      const parentList = this._container.querySelector(`.trip-days`);
      parentList.insertAdjacentHTML(`beforeend`, generateDays({date: new Date()}, 0));
      parentList.querySelector(`.day__counter`).textContent = ``;
      parentList.querySelector(`.day__date`).textContent = ``;

      renderPoints(this._container.querySelector(`.trip-events__list`),
          this._pointsModel.getPoints(), this._onDataChange, this._onViewChange);
    } else {
      render(this._container, new ListOfDaysComponent(this._days), RenderPosition.BEFOREEND);
      let listOfDays = this._container.querySelectorAll(`.trip-events__list`);
      const allPoints = this._pointsModel.getPoints();
      for (let x = 0; x < allPoints.length; x++) {
        renderPoints(listOfDays[x], allPoints[x], this._onDataChange, this._onViewChange);
      }
    }
  }

  _onSortChange() {
    this._updatePoints()
  }

  _onDataChange(pointController, oldPoint, newPoint) {
    const isSuccess = this._pointsModel.updatePoint(oldPoint.id, newPoint);
    if (isSuccess) {
      pointController.render(newPoint);
    }
  }

  _onViewChange() {
    this._showedPointControllers.forEach((it) => it.setDefaultView());
  }

  _handlerFilter(filterType) {
    // this._pointsModel._activeSortType = `event`; /// !!!
    this._sortController._activeSortType = `event`;
    this._sortController.render();
    // console.log('ghfkllh');
    const allPoints = this._pointsModel.getPoints();
    const filteredPoints = getFilteredPoints(allPoints, filterType);
    const parentList = this._container.querySelector(`.trip-days`);
    parentList.innerHTML = ``;
    //  выравниваем
    if (filterType !== FilterType.EVERYTHING) {
      parentList.insertAdjacentHTML(`beforeend`, generateDays({date: new Date()}, 0));
      parentList.querySelector(`.day__counter`).textContent = ``;
      parentList.querySelector(`.day__date`).textContent = ``;

      // const newPoints = renderPoints(this._container.querySelector(`.trip-events__list`),
      //     filteredPoints, this._onDataChange, this._onViewChange);
      // this._showedPointControllers = newPoints;
      this._renderPoints(filteredPoints);
      // //this._removePoints();
      // //renderPoints()
    } else {
      render(this._container, new ListOfDaysComponent(this._days), RenderPosition.BEFOREEND);
      // let listOfDays = this._container.querySelectorAll(`.trip-events__list`);
      // this._showedPointControllers = [];
      // for (let x = 0; x < allPoints.length; x++) {
      //   const newPoint = renderPoints(listOfDays[x], allPoints[x],
      //       this._onDataChange, this._onViewChange);
      //   this._showedPointControllers = this._showedPointControllers.concat(newPoint);
      // }
      this._renderPoints(allPoints);
    }
  }
}
