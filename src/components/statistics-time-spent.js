import {BAR_HEIGHT} from "./statistics.js";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {durationOfPoint} from "../utils/common.js";

export const renderTimeSpentChart = (timeSpentCtx, points) => {
  const timeSpentForCanvas = [];
  points.map((littleArray) => {
    littleArray.map((point) => {
      const actualObject = timeSpentForCanvas.find((obj) => {
        return obj.type === point.type;
      });
      if (actualObject) {
        actualObject.duration += Math.round(durationOfPoint(point.dateTo, point.dateFrom)/60);
      } else {
        const object = {};
        object.type = point.type;
        object.duration = Math.round(durationOfPoint(point.dateTo, point.dateFrom)/60);
        timeSpentForCanvas.push(object);
      }
    })
  });
  console.log(timeSpentForCanvas);

  timeSpentForCanvas.sort((a, b) => {
    return b.duration - a.duration;
  });

  const types = [];
  const durations = [];
  timeSpentForCanvas.forEach((it) => {
    types.push(it.type.toUpperCase());
    durations.push(it.duration);
  });

  timeSpentCtx.height = BAR_HEIGHT * types.length * 0.8;
  return new Chart(timeSpentCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
          labels: types,
          datasets: [{
              data: durations,
              backgroundColor: `#ffffff`,
              hoverBackgroundColor: `cyan`,
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
                  formatter: (val) => `${val}H`
              }
          },
          title: {
              display: true,
              text: `TIME SPENT`,
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
