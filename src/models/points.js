import {getPointsBySort} from "../utils/sort.js";
import {SortType, FilterType} from "../const.js";
import {getFilteredPoints} from "../utils/filter.js";

export default class Points {
  constructor() {
    this.activeSortType = SortType.EVENT;
    this.activeFilterType = FilterType.EVERYTHING;
    this._points = [];


    this._dataChangeHandlers = []; // хранение обработчиков renderFilter
    this._sortChangeHandlers = []; // хранение обработчиков сорта
    this._filterChangeHandlers = [];

    this._dataAboutDestinations = null;
    this._dataAboutOffers = null;
  }

  getPoints() {
    const filteredPoints = getFilteredPoints(this._points, this.activeFilterType);
    return getPointsBySort(filteredPoints, this.activeSortType);
  }

  getPointsAll() {
    return this._points;
  }

  setPoints(allDataPoints) {
    this._points = Array.from(allDataPoints);
    this._callHandlers(this._dataChangeHandlers);
  }

  setSort(sortType) {
    this.activeSortType = sortType;
    this._callHandlers(this._sortChangeHandlers);
  }

  setFilter(filterType) {
    this.activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
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

  addPoint(point) { // куда вставляем новую точку
    const newPointDate = point.dateFrom;
    let foundYourHome = false;
    for (let i = 0; i < this._points.length; i++) {
      if (this._points[i][0].dateFrom.getMonth() === newPointDate.getMonth() &&
        this._points[i][0].dateFrom.getDate() === newPointDate.getDate()) {
        this._points[i].push(point);
        this._points[i].sort((a, b) => a.dateFrom - b.dateFrom);
        this._callHandlers(this._sortChangeHandlers);
        foundYourHome = true;
      }
    }
    if (foundYourHome === false) {
      const newArray = [];
      newArray.push(point);
      for (let j = 0; j < this._points.length; j++) {
        if (this._points[j][0].dateFrom > newPointDate) {
          this._points.splice(j, 0, newArray);
          this._callHandlers(this._sortChangeHandlers);
          foundYourHome = true;
          break;
        }
      }
    }
    if (foundYourHome === false) {
      const newArray = [];
      newArray.push(point);
      this._points.push(newArray);
      this._callHandlers(this._sortChangeHandlers);
      foundYourHome = true;
    }
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

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }


  setDataAboutDestinations(dataOfArray) {
    this._dataAboutDestinations = dataOfArray;
  }
  getDataAboutDestinations() {
    return this._dataAboutDestinations;
  }

  setDataAboutOffers(dataAboutOffers) {
    this._dataAboutOffers = dataAboutOffers;
  }
  getDataAboutOffers() {
    return this._dataAboutOffers;
  }
}
