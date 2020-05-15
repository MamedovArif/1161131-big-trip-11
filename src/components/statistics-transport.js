import {BAR_HEIGHT} from "./statistics.js";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

export const renderTransportChart = (transportCtx, points) => {
  const transportForCanvas = [];
  points.map((littleArray) => {
    littleArray.map((point) => {
      const actualObject = transportForCanvas.find((obj) => {
        return obj.type === point.type;
      });
      if (actualObject) {
        actualObject.count += 1;
      } else {
        const object = {};
        object.type = point.type;
        object.count = 1;
        transportForCanvas.push(object);
      }
    })
  });

  transportForCanvas.sort((a, b) => {
    return b.count - a.count;
  });

  const counts = [];
  const typeForCanvas = [];
  transportForCanvas.forEach((item) => {
    counts.push(item.count);
    typeForCanvas.push(item.type.toUpperCase());
  });

  transportCtx.height = BAR_HEIGHT * typeForCanvas.length * 0.8;
  return new Chart(transportCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
          labels: typeForCanvas,
          datasets: [{
              data: counts,
              backgroundColor: `#ffffff`,
              hoverBackgroundColor: `tomato`,
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
                  formatter: (val) => `${val}x`
              }
          },
          title: {
              display: true,
              text: `TRANSPORT`,
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
