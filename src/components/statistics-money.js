import {BAR_HEIGHT} from "./statistics.js";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

export const renderMoneyChart = (moneyCtx, points) => {
  const dataForCanvas = [];
  points.map((oneDayOfPoints) => {
    oneDayOfPoints.map((point) => {
      const types = dataForCanvas.map((event) => {
        return event.type;
      });
      if (!types.includes(point.type)) {
        const event = {};
        event.type = point.type;
        event.price = point.basePrice;
        dataForCanvas.push(event);
      } else {
        const current = dataForCanvas.find((elem) => {
          return elem.type === point.type;
        });
        current.price += point.basePrice;
      }
    });
  });
  dataForCanvas.sort((a, b) => {
    return b.price - a.price;
  });

  const basePrice = [];
  const typeForCanvas = [];
  dataForCanvas.forEach((eventSorted) =>{
    basePrice.push(eventSorted.price);
    typeForCanvas.push(eventSorted.type);
  });
  const types = typeForCanvas.map((it) => {
    return it.toUpperCase();
  });
  moneyCtx.height = BAR_HEIGHT * basePrice.length * 0.8;

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types,
      datasets: [{
        data: basePrice,
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
          anchor: `end`,
          align: `start`,
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
};
