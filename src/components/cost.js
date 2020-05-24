import AbstractComponent from "./abstract-component.js";

const createCostOfTripTemplate = (totalAmount) => {
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalAmount}</span>
    </p>`
  );
};

export default class Cost extends AbstractComponent {
  constructor(prices) {
    super();
    this._prices = prices;
  }

  getTemplate() {
    return createCostOfTripTemplate(this._prices);
  }
}
