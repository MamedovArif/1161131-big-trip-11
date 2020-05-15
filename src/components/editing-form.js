import {createHeaderEditingForm} from './editing-form-header.js';
import {createOffersEditingForm} from './editing-form-offers.js';
import {createDestinationEditingForm} from './editing-form-destination.js';
import AbstractSmartComponent from "./abstract-smart-component.js";
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};

const createEditingFormTemplate = (object, dataAboutDestinations, dataAboutOffers, externalData) => {
  const cities = dataAboutDestinations.map((obj) => {
    return obj.name;
  });
  if (!object.destination || !cities.includes(object.destination.name)) {
    object.destination = dataAboutDestinations[0];
  }

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

  reset() { // сброс данных при не сохранении
    this._editForm.city = this._defaultEditForm.city;

    this._editForm.destination = this._defaultEditForm.destination;
    this._editForm.type = this._defaultEditForm.type;
    this._editForm.placeholder = this._defaultEditForm.placeholder;
    // this._editForm.options = option[(this._defaultEditForm.type).toLowerCase()]; // !!!
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
    //               НЕ УДАЛЯТЬ!!!
    // const dateBegin = this.getElement()
    //     .querySelector(`input[name = event-start-time]`);
    // this._flatpickr = flatpickr(dateBegin, {
    //   altInput: true,
    //   allowInput: true,
    //   defaultDate: this._editForm.dateFrom || `today`,
    // });
    // const dateEnd = this.getElement()
    //     .querySelector(`input[name = event-end-time]`);
    // this._flatpickr = flatpickr(dateEnd, {
    //   altInput: true,
    //   allowInput: true,
    //   defaultDate: this._editForm.dateTo || `today`,
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
      this._editForm.type = evt.target.textContent.toLowerCase();
      this._editForm.destination = {}; // !!!!

      const actualOfferObject = this._dataAboutOffers.find((object) => {
        return object.type === this._editForm.type;
      });
      this._editForm.offers = actualOfferObject.offres;
      this.rerender();
    });
  }
}
