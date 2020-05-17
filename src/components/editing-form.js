import {createHeaderEditingForm} from './editing-form-header.js';
import {createOffersEditingForm} from './editing-form-offers.js';
import {createDestinationEditingForm} from './editing-form-destination.js';
import AbstractSmartComponent from "./abstract-smart-component.js";
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

// const isCorrectDate = (dateFrom, dateTo) => {
//   if (dateFrom > dateTo) {
//     return false;
//   }
//   return true;
// }

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

  recoveryListeners() { // восстанавливаем !!!!
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
    this._editForm.destination = this._defaultEditForm.destination;
    this._editForm.type = this._defaultEditForm.type;
    this._editForm.basePrice = this._defaultEditForm.basePrice;
    this._editForm.isFavorite = this._defaultEditForm.isFavorite;
    this._editForm.dateFrom = this._defaultEditForm.dateFrom;
    this._editForm.dateTo = this._defaultEditForm.dateTo;

    // this._editForm.options = option[(this._defaultEditForm.type).toLowerCase()]; // !!!
    this.rerender();
  }

  getData() {
    const form = this.getElement();
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

  setOfferChangeHandler(handler) { //вставить в subscribe
    const element = this.getElement().querySelector(`.event__available-offers`);
    if (element) {
      element.addEventListener(`change`, handler);
    }
  }

  _applyFlatpickr() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    const dateBegin = this.getElement()
        .querySelector(`input[name = event-start-time]`);
    this._flatpickr = flatpickr(dateBegin, {
      altInput: true,
      allowInput: false,
      altFormat: `d.m.y H:i`,
      dateFormat: `Z`,
      enableTime: true,
      defaultDate: this._editForm.dateFrom || `today`,
    });
    const dateEnd = this.getElement()
        .querySelector(`input[name = event-end-time]`);
    this._flatpickr = flatpickr(dateEnd, {
      altInput: true,
      allowInput: false,
      altFormat: `d.m.y H:i`,
      dateFormat: `Z`,
      enableTime: true,
      defaultDate: this._editForm.dateTo || `today`,
    });
  }

  _subscribeOnEvents() {
    this._applyFlatpickr();

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
      this._editForm.destination = null;

      const actualOfferObject = this._dataAboutOffers.find((object) => {
        return object.type === this._editForm.type;
      });
      this._editForm.offers = [];
      this.rerender();
    });


    element.querySelector(`input[name = event-favorite]`).addEventListener(`change`, () => {
      this._editForm.isFavorite = !this._editForm.isFavorite;
      this.rerender();
    });

    element.querySelector(`input[name = event-price]`).addEventListener(`blur`, (evt) => {
      this._editForm.basePrice = Math.abs(parseInt(evt.target.value, 10));
      this.rerender();
    });

    const saveButton = element.querySelector(`.event__save-btn`);

    element.querySelector(`input[type = datetime-local]`).addEventListener(`blur`, (evt) => {
      this._editForm.dateFrom = new Date(evt.target.value);
      if (this._editForm.dateFrom > this._editForm.dateTo) {
        saveButton.setAttribute(`disabled`, `disabled`);
      } else {
        saveButton.removeAttribute(`disabled`);
      }
    });

    const elem = element.querySelectorAll(`input[type = datetime-local]`);
    elem[elem.length - 1].addEventListener(`blur`, (evt) => {
      this._editForm.dateTo = new Date(evt.target.value);
      if (this._editForm.dateFrom > this._editForm.dateTo) {
        saveButton.setAttribute(`disabled`, `disabled`);
      } else {
        saveButton.removeAttribute(`disabled`);
      }
    });
  }
}
