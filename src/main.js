import API from "./api.js";
import MenuComponent, {MenuItem} from './components/menu.js';
import {render, RenderPosition} from './utils/render.js';
import StatisticsComponent from "./components/statistics.js";
import TripComponent from "./components/trip.js";
import TripController from './controllers/trip.js';
import PointsModel from './models/points.js';
import FilterController from './controllers/filter.js';

const AUTHORIZATION = `Basic YWxhZGRp7jhoojp96ngio4r66yj5ht7u9`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const tripControls = document.querySelector(`.trip-controls`);
const pageBody = document.querySelector(`.page-body__page-main`);
const pageBodyContainer = pageBody.querySelector(`.page-body__container`);

const tripMain = document.querySelector(`.trip-main`);
const tripInfo = tripMain.querySelector(`.trip-info`);

const menuComponent = new MenuComponent();
render(tripControls.children[0], menuComponent, RenderPosition.AFTEREND);


let totalCosts = [];
let routeOfCities = [];

const api = new API(END_POINT, AUTHORIZATION);

export const pointsModel = new PointsModel();

export const filterController = new FilterController(tripControls, pointsModel);

const statisticsComponent = new StatisticsComponent(pointsModel);
const tripComponent = new TripComponent();
export const tripController = new TripController(tripComponent, pointsModel, api);
render(pageBodyContainer, tripComponent, RenderPosition.BEFOREEND);
render(pageBodyContainer, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

menuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.STATS:
      tripController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TABLE:
      statisticsComponent.hide();
      tripController.show();
      break;
  }
});

const getTotalAmount = (costs) => {
  let totalAmount = costs.reduce((acc, item) => {
    acc += item;
    return acc;
  }, 0);
  return totalAmount;
};

const getFullPoints = function (allDataPoints) {
  allDataPoints.sort((a, b) => a.dateFrom - b.dateFrom);
  allDataPoints.map((item) => {
    totalCosts.push(item.basePrice);
    const addPrices = item.offers.map((it) => {
      return it.price;
    });
    totalCosts = [].concat(totalCosts, addPrices);

    routeOfCities.push(item.destination.name);
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
          pointsModel.setDataAboutOffers(offers);
          pointsModel.setDataAboutDestinations(destinations);
          pointsModel.setPoints(fullDataPoints);
          const totalAmount = getTotalAmount(totalCosts);
          tripController.render(totalAmount, routeOfCities, tripInfo);
        });
    });
  });
