import MenuComponent from './components/menu.js';
import FilterComponent from './components/filters.js';
import {render, RenderPosition} from './utils/render.js';
import {generateDate} from './mock/list-trips.js';
import {generatePoints} from './mock/route-point.js';
//import TripController from './controllers/trip.js';
import TripController from './controllers/trip.js';

const NUMBER_OF_STOPS = 2;
const QUANTITY_OF_DAYS = 4;

const tripControls = document.querySelector(`.trip-controls`);

//export const tripEvents = document.querySelector(`.trip-events`);

render(tripControls.children[0], new MenuComponent(), RenderPosition.AFTEREND);
render(tripControls, new FilterComponent(), RenderPosition.BEFOREEND);

const week = [];
for (let y = 0; y < QUANTITY_OF_DAYS; y++) {
  week.push(generateDate());
}
week.sort((a, b) => a.date - b.date);

let allDataPoints = [];
let totalCosts = [];
let routeOfCities = new Set();

for (let j = 0; j < week.length; j++) {
  const points = generatePoints(NUMBER_OF_STOPS, week[j].date);
  points.sort((a, b) => {
    return a.timeBegin - b.timeBegin;
  });
  allDataPoints.push(points);

  for (let i = 0; i < points.length; i++) {
    totalCosts.push(points[i].price);
    routeOfCities.add(points[i].city);
    // renderPoint(listDays[j], points[i]);
  }
}

const tripController = new TripController();
tripController.render(week, allDataPoints, totalCosts, routeOfCities);
