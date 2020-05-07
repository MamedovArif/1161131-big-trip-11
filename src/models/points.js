import {getPointsBySort} from "../utils/sort.js";
import {SortType} from "../const.js";

export default class Points {
  constructor() {
    this._activeSortType = SortType.EVENT;
    this._points = [];


    this._dataChangeHandlers = []; // хранение обработчиков точек
    this._sortChangeHandlers = []; // хранение обработчиков сорта
  }

  getPoints() {
    console.log(this._points);
    console.log(this._activeSortType);
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

  removePoint(id) {
    const pointsWithoutOne = this._points.map((littleArray) => {
      const index = littleArray.findIndex((item) => item.id === id);
      if (index === -1) {
        return littleArray;
      }
      littleArray = [].concat(littleArray.slice(0, index), littleArray.slice(index + 1));
      return littleArray;
    });
    for (let i = 0; i < pointsWithoutOne.length; i++) {
      if (pointsWithoutOne[i].length === 0) {
        pointsWithoutOne.splice(i, 1);
      }
    }
    this._points = pointsWithoutOne;
  }

  addPoint(point) { // не понятно к какой дате добавляем 12
    this._points = [].concat(point, this._points);
    this._callHandlers(this._dataChangeHandlers); // какие же обработчики вызываются
  }

  updatePoint(id, newPoint) {
    let isSuccess = false;
    this._points = this._points.map((littleArray) => {
      const index = littleArray.findIndex((point) => point.id === id);

      if (index === -1) {
        return littleArray;
      }
      isSuccess = true;
      littleArray = [].concat(littleArray.slice(0, index),
          newPoint, littleArray.slice(index + 1));
      return littleArray;
      // this._callHandlers(this._dataChangeHandlers); // нужен ли он если сортировка не обновл?
    });
    return isSuccess;
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
