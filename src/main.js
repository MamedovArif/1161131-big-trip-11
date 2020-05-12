import API from "./api.js";
import MenuComponent from './components/menu.js';
import {render, RenderPosition} from './utils/render.js';
import TripController from './controllers/trip.js';
import PointsModel from './models/points.js';
import FilterController from './controllers/filter.js';

const AUTHORIZATION = `Basic YWxhZGRp7jhoojp96ngio4r66yj5ht7uYW1l`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const tripControls = document.querySelector(`.trip-controls`);

const tripEvents = document.querySelector(`.trip-events`);
const tripMain = document.querySelector(`.trip-main`);

const menuComponent = new MenuComponent();
render(tripControls.children[0], menuComponent, RenderPosition.AFTEREND);


let totalCosts = [];
let routeOfCities = new Set();

const api = new API(END_POINT, AUTHORIZATION);

export const pointsModel = new PointsModel();

export const filterController = new FilterController(tripControls, pointsModel);

const tripController = new TripController(tripEvents, pointsModel, api);

// //menuComponent.setOnChange((menuItem) => {  ///// 12 stats
// // switch (menuItem) {
// //    case MenuItem.NEW_EVENT:
// //      menuComponent.setActiveItem(MenuItem.TABLE);
// //      tripController.createTask();
// //      break;
// //  }
// //});
const getFullPoints = function (allDataPoints) {
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
  return fullDataPoints;
};

export const buttonEvent = tripMain.querySelector(`.btn`);
buttonEvent.addEventListener(`click`, () => {
  tripController.createPoint();
});

api.getAddOffers()
  .then((offers) => {
    api.getCities()
    .then((array) => {
      let destinations = [].concat(array);
      api.getPoints()
        .then((allDataPoints) => {
          const fullDataPoints = getFullPoints(allDataPoints);
          console.log(allDataPoints);
          console.log(destinations);
          console.log(offers);
          pointsModel.setDataAboutOffers(offers);
          pointsModel.setDataAboutDestinations(destinations);
          pointsModel.setPoints(fullDataPoints);
          tripController.render(totalCosts, routeOfCities, tripMain);
        });
    });
  });

