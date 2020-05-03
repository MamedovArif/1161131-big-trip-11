import {getPointsBySort} from "../utils/sort.js";
import {SortType} from "../const.js";

export default class Points {
  constructor() {
    this._dates = [];
    this._activeSortType = SortType.EVENT;
    this._points = [];


    this._dataChangeHandlers = []; // хранение обработчиков точек
    this._sortChangeHandlers = []; // хранение обработчиков сорта
  }

  getPoints() {
    return getPointsBySort(this._points, this._activeSortType);
  }

  getPointsAll() {
    return this._points;
  }

  setPoints(allDataPoints) {
    this._points = Array.from(allDataPoints);
    this._callHandlers(this._dataChangeHandlers);
  }

  setSort(sortType) {
    this._activeSortType = sortType;
    this._callHandlers(this._sortChangeHandlers);
  }
//////////////////
  removePoint(id) { // у меня двойная структура так что не найдет
    const pointsWithoutOne = this._points.map((littleArray) => {
      const index = littleArray.findIndex((item) => item.id === id);
      if (index === -1) {
        return littleArray;
      }
      return littleArray = [].concat(littleArray.slice(0, index), littleArray.slice(index + 1));
    });
    console.log(pointsWithoutOne);
    for (let i = 0; i < pointsWithoutOne.length; i++) {
      if (pointsWithoutOne[i].length === 0) {
        pointsWithoutOne.splice(i, 1);
      }
    }
    this._points = pointsWithoutOne;
  }

  addPoint(point) { //не понятно к какой дате добавляем
    this._points = [].concat(point, this._points);
    this._callHandlers(this._dataChangeHandlers); //какие же обработчики вызываются
  }
/////////////////
  updatePoint(id, newPoint) {
    this._dates.map((date) => {
      const index = date.findIndex((point) => point.id === id);

      if (index === -1) {
      return false;
      }
      date = [].concat(date.slice(0, index),
        newPoint, date.slice(index + 1));

      this._callHandlers(this._dataChangeHandlers);
      return true;
    });
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setSortChangeHandler(handler) {
    this._sortChangeHandlers.push(handler);
  }
}
