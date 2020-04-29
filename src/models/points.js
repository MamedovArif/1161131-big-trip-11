export default class Points {
  constructor() {
    this._dates = [];
    this._dataChangeHandlers = []; // observer
  }

  getPoints() {
    return this._points;
  }

  setPoints(allDataPoints) {
    this._points = Array.from(allDataPoints);
    this._callHandlers(this._dataChangeHandlers);
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
}
