import MenuComponent from './components/menu.js';
import FilterComponent from './components/filters.js';
import {render, RenderPosition} from './utils/render.js';
import {generateDate} from './mock/list-trips.js';
import {generatePoints} from './mock/route-point.js';
import TripController, {createDefaultForm} from './controllers/trip.js';
import PointsModel from './models/points.js';

const NUMBER_OF_STOPS = 7;
//const QUANTITY_OF_DAYS = 4;

const tripControls = document.querySelector(`.trip-controls`);

const tripEvents = document.querySelector(`.trip-events`);
const tripMain = document.querySelector(`.trip-main`);


render(tripControls.children[0], new MenuComponent(), RenderPosition.AFTEREND);
export const filterComponent = new FilterComponent();
render(tripControls, filterComponent, RenderPosition.BEFOREEND);


const buttonEvent = tripMain.querySelector(`.btn`);
let tiedСreateDefaultForm = createDefaultForm.bind(null, buttonEvent, tripEvents);
buttonEvent.addEventListener(`click`, tiedСreateDefaultForm);


// const datesOfTravel = [];
// for (let y = 0; y < QUANTITY_OF_DAYS; y++) {
//   datesOfTravel.push(generateDate());
// }
// datesOfTravel.sort((a, b) => a.date - b.date);

let allDataPoints = [];
let totalCosts = [];
let routeOfCities = new Set();

allDataPoints = generatePoints(NUMBER_OF_STOPS) //, datesOfTravel[j].date))
console.log(allDataPoints);

allDataPoints.sort((a, b) => a.timeBegin - b.timeBegin);

allDataPoints.map((item) => {
  totalCosts.push(item.price);
  routeOfCities.add(item.city);
});


let fullDataPoints = [[allDataPoints[0]]];

for (let i = 0; i < allDataPoints.length - 1; i++) {

  if (allDataPoints[i].timeBegin.getDate() === allDataPoints[i + 1].timeBegin.getDate() &&
      allDataPoints[i].timeBegin.getMonth() === allDataPoints[i + 1].timeBegin.getMonth()) {
    fullDataPoints[fullDataPoints.length - 1].push(allDataPoints[i + 1])
  } else {
    let littleArray = [];
    littleArray.push(allDataPoints[i + 1]);
    fullDataPoints.push(littleArray)
  }
}

console.log(fullDataPoints);

// for (let j = 0; j < datesOfTravel.length; j++) {
//   const points = generatePoints(NUMBER_OF_STOPS, datesOfTravel[j].date);
//   points.sort((a, b) => {
//     return a.timeBegin - b.timeBegin;
//   });
//   allDataPoints.push(points);

//   for (let i = 0; i < points.length; i++) {
//     totalCosts.push(points[i].price);
//     routeOfCities.add(points[i].city);
//   }
// }

export const pointsModel = new PointsModel();
pointsModel.setPoints(fullDataPoints);

const tripController = new TripController(tripEvents, pointsModel);
tripController.render(totalCosts, routeOfCities, tripMain);
