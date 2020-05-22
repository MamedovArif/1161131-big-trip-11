import API from "./api/index.js";
import Store from "./api/store.js";
import Provider from "./api/provider.js";
import MenuComponent, {MenuItem} from './components/menu.js';
import {render, RenderPosition} from './utils/render.js';
import StatisticsComponent from "./components/statistics.js";
import TripComponent from "./components/trip.js";
import TripController from './controllers/trip.js';
import PointsModel from './models/points.js';
import FilterController from './controllers/filter.js';

const AUTHORIZATION = `Basic YWxhZGRp7jhoojp96ngio4r66yj5ht7u9`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;
const STORE_PREFIX = `big-trip-localstorage`;
const STORE_VER_POINTS = `v1`;
const STORE_VER_DESTINATIONS = `v2`;
const STORE_VER_OFFERS = `v3`;
const STORE_POINTS = `${STORE_PREFIX}-${STORE_VER_POINTS}`;
const STORE_DESTINATIONS = `${STORE_PREFIX}-${STORE_VER_DESTINATIONS}`;
const STORE_OFFERS = `${STORE_PREFIX}-${STORE_VER_OFFERS}`;

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
const storePoints = new Store(STORE_POINTS,  window.localStorage);
const storeDestinations = new Store(STORE_DESTINATIONS, window.localStorage);
const storeOffers = new Store(STORE_OFFERS, window.localStorage);
const apiWithProvider = new Provider(api, storePoints, storeDestinations, storeOffers);

export const pointsModel = new PointsModel();

export const filterController = new FilterController(tripControls, pointsModel);

const statisticsComponent = new StatisticsComponent(pointsModel);
const tripComponent = new TripComponent();
export const tripController = new TripController(tripComponent, pointsModel, apiWithProvider);
render(pageBodyContainer, tripComponent, RenderPosition.BEFOREEND);
render(pageBodyContainer, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

export const buttonEvent = tripMain.querySelector(`.btn`);
buttonEvent.addEventListener(`click`, () => {
  tripController.createPoint();
});

menuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.STATS:
      if (!buttonEvent.hasAttribute(`disabled`)) {
        buttonEvent.setAttribute(`disabled`, `disabled`);
      }
      tripController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TABLE:
      if (buttonEvent.hasAttribute(`disabled`)) {
        buttonEvent.removeAttribute(`disabled`);
        buttonEvent.addEventListener(`click`, () => {
          tripController.createPoint();
        });
      }
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
      let oneDayOfPoints = [];
      oneDayOfPoints.push(allDataPoints[i + 1]);
      fullDataPoints.push(oneDayOfPoints);
    }
  }
  return fullDataPoints;
};

apiWithProvider.getAddOffers()
  .then((offers) => {
    apiWithProvider.getCities()
    .then((serverDestinations) => {
      let destinations = [].concat(serverDestinations);
      apiWithProvider.getPoints()
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

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then((reg) => {
      console.log(`Registration succeeded. Scope is ${reg.scope}`);
    }).catch((error) => {
      console.log(`Registration failed with ${error}`)
  });
})

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});


