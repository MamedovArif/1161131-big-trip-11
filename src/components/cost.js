import {createElement} from '../utils.js';

const createCostOfTripTemplate = (array) => {
  let sum = array.reduce((acc, item) => {
    acc += item;
    return acc;
  }, 0);

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${sum}</span>
    </p>`
  );
};

export default class Cost {
  constructor(prices) {
    this._prices = prices;
    this._element = null;
  }

  getTemplate() {
    return createCostOfTripTemplate(this._prices);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
