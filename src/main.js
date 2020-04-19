import MenuComponent from './components/menu.js';
import FilterComponent from './components/filters.js';
import {render, RenderPosition} from './utils/render.js';
import {generateDate} from './mock/list-trips.js';
import {generatePoints} from './mock/route-point.js';
import TripController, {createDefaultForm} from './controllers/trip.js';

const NUMBER_OF_STOPS = 2;
const QUANTITY_OF_DAYS = 4;

const tripControls = document.querySelector(`.trip-controls`);

const tripEvents = document.querySelector(`.trip-events`);
const tripMain = document.querySelector(`.trip-main`);

render(tripControls.children[0], new MenuComponent(), RenderPosition.AFTEREND);
render(tripControls, new FilterComponent(), RenderPosition.BEFOREEND);

// const buttonEvent = tripMain.querySelector(`.btn`);
// buttonEvent.addEventListener(`click`, createDefaultForm.bind(null,
//     buttonEvent, tripEvents));


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
  }
}

const tripController = new TripController(tripEvents);
tripController.render(week, allDataPoints, totalCosts, routeOfCities, tripMain);
