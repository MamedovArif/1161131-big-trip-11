import AbstcractSmartComponent from "./abstract-smart-component.js";
import {renderMoneyChart} from "./statistics-money.js";
import {renderTransportChart} from "./statistics-transport.js";
import {renderTimeSpentChart} from "./statistics-time-spent.js";

export const BAR_HEIGHT = 55;

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class Statistics extends AbstcractSmartComponent {
  constructor(points) {
    super();
    this._points = points;

    this._money = null;
    this._transport = null;
    this._timeSpent = null;
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  show() {
    super.show();
    this.rerender(this._points);
  }

  recoveryListeners() {}

  rerender(points) {
    this._points = points;

    super.rerender();

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();

    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpentCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts(); //

    this._money = renderMoneyChart(moneyCtx, this._points.getPointsAll());
    this._transport = renderTransportChart(transportCtx, this._points.getPointsAll());
    this._timeSpent = renderTimeSpentChart(timeSpentCtx, this._points.getPointsAll());
  }

  _resetCharts() {
    if (this._money) {
      this._money.destroy();
      this._money = null;
    }

    if (this._transport) {
      this._transport.destroy();
      this._transport = null;
    }

    if (this._timeSpent) {
      this._timeSpent.destroy();
      this._timeSpent = null;
    }
  }

  // destroy() {
  //   remove(this._money);
  //   remove(this._transport);
  //   remove(this._timeSpent);
  // }
}
