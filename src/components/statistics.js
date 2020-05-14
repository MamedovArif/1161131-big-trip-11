import AbstcractSmartComponent from "./abstract-smart-component.js";
import Chart from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';
// import moment from "moment";
// import flatpickr from "flatpickr";

// Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
const BAR_HEIGHT = 55;
//
// transportCtx.height = BAR_HEIGHT * 4;
// timeSpendCtx.height = BAR_HEIGHT * 4;
// points.map((littleArray) => {
//     littleArray.map((point) => {
//       if (!types.includes(point.type)) {
//         types.push(point.type);
//         money.push(point.basePrice);
//       } else {

//         const index = types.indexOf(point.type);
//         money[index] = money[index] + point.basePrice;
//       }
//     })
//   })

const renderMoneyChart = (moneyCtx, points) => {
  const dataForCanvas = []
  points.map((littleArray) => {
    littleArray.map((point) => {
      const types = dataForCanvas.map((object) => {
        return object.type;
      })
      if (!types.includes(point.type)) {
        const obj = {};
        obj.type = point.type;
        obj.price = point.basePrice;
        dataForCanvas.push(obj);
      } else {
        const current = dataForCanvas.find((elem) => {
          return elem.type === point.type;
        });
        current.price += point.basePrice;
      }
    })
  });
  dataForCanvas.sort((a, b) => {
    return b.price - a.price;
  })
  console.log(dataForCanvas);
  const basePrice = [];
  const typeForCanvas = [];
  dataForCanvas.forEach((objectSorted) =>{
    basePrice.push(objectSorted.price);
    typeForCanvas.push(objectSorted.type);
  });
  console.log(basePrice);
  console.log(typeForCanvas);
  moneyCtx.height = BAR_HEIGHT * basePrice.length * 0.8;//types.length;

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
        labels: typeForCanvas, //
        datasets: [{
            data: basePrice, //
            backgroundColor: `#ffffff`,
            hoverBackgroundColor: `lightgreen`,
            anchor: `start`
        }]
    },
    options: {
        plugins: {
            datalabels: {
                font: {
                    size: 13
                },
                color: `#000000`,
                anchor: 'end',
                align: 'start',
                formatter: (val) => `€ ${val}`
            }
        },
        title: {
            display: true,
            text: `MONEY`,
            fontColor: `#000000`,
            fontSize: 23,
            position: `left`
        },
        scales: {
            yAxes: [{
                ticks: {
                    fontColor: `#000000`,
                    padding: 5,
                    fontSize: 13,
                },
                gridLines: {
                    display: false,
                    drawBorder: false
                },
                barThickness: 44,
            }],
            xAxes: [{
                ticks: {
                    display: false,
                    beginAtZero: true,
                },
                gridLines: {
                    display: false,
                    drawBorder: false
                },
                minBarLength: 50
            }],
        },
        legend: {
            display: false
        },
        tooltips: {
            enabled: false,
        }
    }
  });
}

const createStatisticsTemplate = ({points}) => {
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
  constructor({points}) {
    super();
    this._points = points;

    this._money = null;
    this._transport = null;
    this._timeSpent = null;
  }

  getTemplate() {
    return createStatisticsTemplate({
      points: this._points.getPointsAll(),
    });
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
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._money = renderMoneyChart(moneyCtx, this._points.getPointsAll());
    //this._colorsChart = renderColorsChart(colorsCtx, this._tasks.getTasks());
  }

   _resetCharts() {
    if (this._daysChart) {
      this._daysChart.destroy();
      this._daysChart = null;
    }

    if (this._colorsChart) {
      this._colorsChart.destroy();
      this._colorsChart = null;
    }
  }
}



// const transportChart = new Chart(transportCtx, {
//     plugins: [ChartDataLabels],
//     type: `horizontalBar`,
//     data: {
//         labels: [`FLY`, `DRIVE`,  `RIDE`],
//         datasets: [{
//             data: [4, 2, 1],
//             backgroundColor: `#ffffff`,
//             hoverBackgroundColor: `#ffffff`,
//             anchor: `start`
//         }]
//     },
//     options: {
//         plugins: {
//             datalabels: {
//                 font: {
//                     size: 13
//                 },
//                 color: `#000000`,
//                 anchor: 'end',
//                 align: 'start',
//                 formatter: (val) => `${val}x`
//             }
//         },
//         title: {
//             display: true,
//             text: `TRANSPORT`,
//             fontColor: `#000000`,
//             fontSize: 23,
//             position: `left`
//         },
//         scales: {
//             yAxes: [{
//                 ticks: {
//                     fontColor: `#000000`,
//                     padding: 5,
//                     fontSize: 13,
//                 },
//                 gridLines: {
//                     display: false,
//                     drawBorder: false
//                 },
//                 barThickness: 44,
//             }],
//             xAxes: [{
//                 ticks: {
//                     display: false,
//                     beginAtZero: true,
//                 },
//                 gridLines: {
//                     display: false,
//                     drawBorder: false
//                 },
//                 minBarLength: 50
//             }],
//         },
//         legend: {
//             display: false
//         },
//         tooltips: {
//             enabled: false,
//         }
//     }
// });
