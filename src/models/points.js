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

//   export const getPointsBySort = (points, sortType) => {
//   switch (sortType) {
//     case SortType.EVENT:
//       return getSortOnEvent(points);
//     case SortType.TIME:
//       return getSortOnTime(points);
//     case SortType.PRICE:
//       return getSortOnPrice(points);
//     default:
//       throw new Error('getPointsBySort принимает неверный тип');
//   }
//   return points;
// }

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
