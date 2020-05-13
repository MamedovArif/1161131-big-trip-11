import {createHeaderEditingForm} from './editing-form-header.js';
import {createOffersEditingForm} from './editing-form-offers.js';
import {createDestinationEditingForm} from './editing-form-destination.js';
import AbstractSmartComponent from "./abstract-smart-component.js";
import {offers} from "../mock/route-point.js";
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};

const createEditingFormTemplate = (object, dataAboutDestinations, dataAboutOffers, externalData) => {
  const type = object.type;
  const allOffers = dataAboutOffers.find((item) => {
    return item.type === type;
  });

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      ${createHeaderEditingForm(object, dataAboutDestinations, externalData)}
      <section class="event__details">
        ${(allOffers.offers.length === 0) ? `` : createOffersEditingForm(object, dataAboutOffers)}
        ${(object.destination) ? createDestinationEditingForm(object) : ``}
      </section>
    </form>`
  );
};

// const stringToDate = (string) => { // для flatpickr другая функция
//   const dates = string.split(` `);
//   const date = dates[0].split(`.`);
//   const time = dates[1].split(`:`);

//   date[2] = Number(`20` + date[2]);
//   date[1] = Number(date[1]) - 1;
//   date[0] = Number(date[0]);
//   time[0] = Number(time[0]);
//   time[1] = Number(time[1]);
//   return new Date(date[2], date[1], date[0], time[0], time[1]);
// };

// const parseFormData = (formData, form, id) => {
//   const definitionFavorite = (bool) => {
//     if (bool) {
//       return true;
//     }
//     return false;
//   }
//   const transferText = form.querySelector(`.event__label`).textContent.trim().split(` `);
//   const type = transferText[0].toLowerCase();
//   const formObject = {
//     "id": id,
//     "basePrice": Math.abs(parseInt(formData.get(`event-price`))),
//     "dateFrom": stringToDate(formData.get(`event-start-time`)),
//     "dateTo": stringToDate(formData.get(`event-end-time`)),
//     "destination": destinations[formData.get(`event-destination`)],
//     "isFavorite": definitionFavorite(formData.get(`event-favorite`)),
//     "type": type,
//   };
//   formObject.offers = offers[formObject.type];
//   for (let offer of formObject.offers) {
//     offer.isChecked =
//       formData.get(`event-offer-${offer.title.toLowerCase().split(` `).join(`-`)}`);
//   }
//   return formObject;
// };

export default class FormForEdit extends AbstractSmartComponent {
  constructor(editForm, destinations, dataAboutOffers) {
    super();
    this._editForm = Object.assign({}, editForm);
    this._defaultEditForm = editForm;
    this._destinations = destinations;
    this._dataAboutOffers = dataAboutOffers;
    this._externalData = DefaultData;

    this._flatpickr = null;
    this._submitHandler = null;
    this._deleteButtonClickHandler = null;

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditingFormTemplate(this._editForm,
      this._destinations, this._dataAboutOffers, this._externalData);
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    super.removeElement();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setCloseHandler(this._closeHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  reset() {
    this._editForm.city = this._defaultEditForm.city;

    this._editForm.destination = this._defaultEditForm.destination;
    this._editForm.type = this._defaultEditForm.type;
    this._editForm.placeholder = this._defaultEditForm.placeholder;
    this._editForm.options = option[(this._defaultEditForm.type).toLowerCase()]; // !!!
    this.rerender();
  }

  getData() {
    const form = this.getElement().parentElement.querySelector(`.trip-events__item`);
    return {
      formData: new FormData(form),
      form,
    };
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }
  setCloseHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
        .addEventListener(`click`, handler);
    this._closeHandler = handler;
  }

  setFavoriteChangeHandler(handler) {
    this.getElement().querySelector(`input[name = event-favorite]`)
        .addEventListener(`change`, handler);
  }

  setOfferChangeHandler(handler) {
    const element = this.getElement().querySelector(`.event__available-offers`);
    if (element) {
      element.addEventListener(`change`, handler);
    }
  }

  setBasePriceChangeHandler(handler) {
    this.getElement().querySelector(`input[name = event-price]`)
        .addEventListener(`blur`, handler);
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }
    //                НЕ УДАЛЯТЬ!!!
    // const dateBegin = this.getElement()
    //     .querySelector(`input[name = event-start-time]`);
    // this._flatpickr = flatpickr(dateBegin, {
    //   altInput: true,
    //   allowInput: true,
    //   defaultDate: this._editForm.timeBegin || `today`,
    // });
    // const dateEnd = this.getElement()
    //     .querySelector(`input[name = event-end-time]`);
    // this._flatpickr = flatpickr(dateEnd, {
    //   altInput: true,
    //   allowInput: true,
    //   defaultDate: this._editForm.timeEnd || `today`,
    // });
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    element.querySelector(`select[name = event-destination]`)
        .addEventListener(`change`, (evt) => {
          this._editForm.destination = this._destinations.find((item) => {
            return item.name === evt.target.value;
          });
          this.rerender();
        });
    element.querySelector(`.event__type-list`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `LABEL`) {
        return;
      }
      this._editForm.type = evt.target.textContent;
      this._editForm.destination = destinations[`noChoose`]; // !!!!

      this._editForm.offers = offers[(this._editForm.type).toLowerCase()];
      this.rerender();
    });
  }
}
