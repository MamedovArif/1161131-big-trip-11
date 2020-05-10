import {formatTime, formatTimeDate, upperFirstElement} from '../utils/common.js';
import {pretext} from "../const.js";
import {api} from "../main.js";

// import {encode} from "he";

const typesTransfer = ["taxi", "bus", "train", "ship", "transport", "drive", "flight"];
const typesActivity = ["check-in", "sightseeing", "restaurant"];

const generateTransfer = (typeMove) => {
  return (
    `<div class="event__type-item">
      <input id="event-type-${typeMove}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeMove}">
      <label class="event__type-label  event__type-label--${typeMove}" for="event-type-${typeMove}-1">${upperFirstElement(typeMove)}</label>
    </div>`
  );
}

const generateActivity = (typePlace) => {
  return (
    `<div class="event__type-item">
      <input id="event-type-${typePlace}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typePlace}">
      <label class="event__type-label  event__type-label--${typePlace}" for="event-type-${typePlace}-1">${upperFirstElement(typePlace)}</label>
    </div>`
  )
}
// const destinations = api.getCities()
//   .then((object) => {
//     return object;
//   });

// const generateCities = (object) => {
//   const {name} = object;
//   return (
//     `<option value="${name}" ${(city === ${name}) ? `selected` : ``}>${name}</option>`
//   )
// }

const createHeaderEditingForm = (object) => {
  const {type, destination, dateFrom, dateTo, basePrice, isFavorite} = object;
  const placeholder = ``;
  const city = destination.name;
  //upperFirstElement

  // const timeStart = encode(timeBegin);
  // const timeFinish = encode(timeEnd);
  // const safePrice = encode(price);
  // const town = encode(city);

  const hoursBegin = formatTime(dateFrom);
  const dateBegin = formatTimeDate(dateFrom);
  const hoursFinish = formatTime(dateTo);
  const dateFinish = formatTimeDate(dateTo);
  const isChecked = (isFavorite) ? `checked` : ``;

  let transfer = [];
  for (let i = 0; i < typesTransfer.length; i++) {
    transfer.push(generateTransfer(typesTransfer[i]));
  }

  let activity = [];
  for (let j = 0; j < typesActivity.length; j++) {
    activity.push(generateActivity(typesActivity[j]));
  }

  // let cities = [];
  // for (let w = 0; w < destinations.length; w++) {
  //   cities.push(generateCities(destinations[w]));
  // }

  return (
    `<header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Transfer</legend>
            ${transfer.join(`\n`)}
          </fieldset>

          <fieldset class="event__type-group">
            <legend class="visually-hidden">Activity</legend>
            ${activity.join(`\n`)}
          </fieldset>
        </div>
      </div>

      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${upperFirstElement(type)} ${pretext[type.toLowerCase()]}
        </label>
        <select class="event__input event__input--destination"
        name="event-destination" id="destination-list-1">
          <option disabled ${(city === ``) ? `selected` : ``}></option>
          <option> {cities.join()}</option>
        </select>

      </div>

      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">
          From
        </label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text"
         name="event-start-time" value="${dateBegin} ${hoursBegin}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">
          To
        </label>
        <input class="event__input  event__input--time" id="event-end-time-1"
        type="text" name="event-end-time" value="${dateFinish} ${hoursFinish}">
      </div>

      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="number"
        name="event-price" value="${basePrice}">
      </div>

      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Delete</button>

      <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden"
          type="checkbox" name="event-favorite" ${isChecked} value="${isFavorite}">
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209
          9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574
          6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>

      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </header>`
  );
};

export {createHeaderEditingForm};
