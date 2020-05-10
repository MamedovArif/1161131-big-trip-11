import API from "./api.js";
import MenuComponent from './components/menu.js';
import FilterComponent from './components/filters.js';
import {render, RenderPosition} from './utils/render.js';
//import {generatePoints} from './mock/route-point.js';
import TripController from './controllers/trip.js';
import PointsModel from './models/points.js';
import FilterController from './controllers/filter.js';

//const NUMBER_OF_STOPS = 7;
const AUTHORIZATION = `Basic YWxhZGRp7jhoojp96ngio4r66yj5ht7uYW1l`; //

const tripControls = document.querySelector(`.trip-controls`);

const tripEvents = document.querySelector(`.trip-events`);
const tripMain = document.querySelector(`.trip-main`);

const menuComponent = new MenuComponent();
render(tripControls.children[0], menuComponent, RenderPosition.AFTEREND);

let allDataPoints = [];
let totalCosts = [];
let routeOfCities = new Set();

//allDataPoints = generatePoints(NUMBER_OF_STOPS);
const api = new API(AUTHORIZATION);

// allDataPoints.sort((a, b) => a.dateFrom - b.dateFrom);

// allDataPoints.map((item) => {
//   totalCosts.push(item.basePrice);
//   routeOfCities.add(item.destination.name);
// });

// let fullDataPoints = [[allDataPoints[0]]];

// for (let i = 0; i < allDataPoints.length - 1; i++) {

//   if (allDataPoints[i].dateFrom.getDate() === allDataPoints[i + 1].dateFrom.getDate() &&
//       allDataPoints[i].dateFrom.getMonth() === allDataPoints[i + 1].dateFrom.getMonth()) {
//     fullDataPoints[fullDataPoints.length - 1].push(allDataPoints[i + 1]);
//   } else {
//     let littleArray = [];
//     littleArray.push(allDataPoints[i + 1]);
//     fullDataPoints.push(littleArray);
//   }
// }

export const pointsModel = new PointsModel();
//pointsModel.setPoints(fullDataPoints);

export const filterController = new FilterController(tripControls, pointsModel); //ffffffff

const tripController = new TripController(tripEvents, pointsModel);
//tripController.render(totalCosts, routeOfCities, tripMain);

// //menuComponent.setOnChange((menuItem) => {  ///// 12 stats
// // switch (menuItem) {
// //    case MenuItem.NEW_EVENT:
// //      menuComponent.setActiveItem(MenuItem.TABLE);
// //      tripController.createTask();
// //      break;
// //  }
// //});

export const buttonEvent = tripMain.querySelector(`.btn`);
buttonEvent.addEventListener(`click`, () => {
  tripController.createPoint();
});

api.getCities()
  .then((cities) => {
    console.log(cities);
  });

api.getAddOffers()
  .then((offerObject) => {
    console.log(offerObject);
  });

api.getPoints()
  .then((allDataPoints) => {
    allDataPoints.sort((a, b) => a.dateFrom - b.dateFrom);

    allDataPoints.map((item) => {
      totalCosts.push(item.basePrice);
      routeOfCities.add(item.destination.name);
    });

    let fullDataPoints = [[allDataPoints[0]]];

    for (let i = 0; i < allDataPoints.length - 1; i++) {
      if (allDataPoints[i].dateFrom.getDate() === allDataPoints[i + 1].dateFrom.getDate() &&
          allDataPoints[i].dateFrom.getMonth() === allDataPoints[i + 1].dateFrom.getMonth()) {
        fullDataPoints[fullDataPoints.length - 1].push(allDataPoints[i + 1]);
      } else {
        let littleArray = [];
        littleArray.push(allDataPoints[i + 1]);
        fullDataPoints.push(littleArray);
      }
    }
    pointsModel.setPoints(fullDataPoints);
    tripController.render(totalCosts, routeOfCities, tripMain);
  })
