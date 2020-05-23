import {createHeaderEditingForm} from './editing-form-header.js';
import {createOffersEditingForm} from './editing-form-offers.js';
import {createDestinationEditingForm} from './editing-form-destination.js';
import AbstractSmartComponent from "./abstract-smart-component.js";
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

const getTime = (field) => {
  const stringDates = field.value.split(` `);
  let currentDate;
  if (stringDates.length !== 1) {
    const dateValues = stringDates[0].split(`.`);
    const timeValues = stringDates[1].split(`:`);
    currentDate = new Date(`20` + dateValues[2], Number(dateValues[1]) - 1, dateValues[0],
        timeValues[0], timeValues[1]);
  } else {
    currentDate = new Date(stringDates[0]);
  }
  return currentDate;
};

const applyFlatpickrStart = (flatpickrStart, context, editForm, flatpickrEnd) => {
  if (flatpickrStart) {
    flatpickrStart.destroy();
    flatpickrStart = null;
  }

  const dateBegin = context.querySelector(`input[name = event-start-time]`);
  const dateEnd = context.querySelector(`input[name = event-end-time]`);

  const currentTo = getTime(dateEnd);

  flatpickrStart = flatpickr(dateBegin, {
    altInput: true,
    allowInput: false,
    altFormat: `d.m.y H:i`,
    maxDate: currentTo,
    disableMobile: true,
    onClose() {
      editForm[`dateFrom`] = getTime(dateBegin);
      applyFlatpickrEnd(flatpickrEnd, context, editForm);
    },
    dateFormat: `Z`,
    enableTime: true,
    defaultDate: editForm[`dateFrom`] || `today`,
  });
};

const applyFlatpickrEnd = (flatpickrEnd, context, editForm, flatpickrStart) => {
  if (flatpickrEnd) {
    flatpickrEnd.destroy();
    flatpickrEnd = null;
  }

  const dateBegin = context.querySelector(`input[name = event-start-time]`);
  const dateEnd = context.querySelector(`input[name = event-end-time]`);

  const currentFrom = getTime(dateBegin);

  flatpickrEnd = flatpickr(dateEnd, {
    altInput: true,
    allowInput: false,
    altFormat: `d.m.y H:i`,
    minDate: currentFrom,
    disableMobile: true,
    onClose() {
      editForm[`dateTo`] = getTime(dateEnd);
      applyFlatpickrStart(flatpickrStart, context, editForm);
    },
    dateFormat: `Z`,
    enableTime: true,
    defaultDate: editForm[`dateTo`] || `today`,
  });
};

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
};

const createEditingFormTemplate = (dataForPoint, dataAboutDestinations, dataAboutOffers, externalData) => {
  const type = dataForPoint.type;
  const allOffers = dataAboutOffers.find((item) => {
    return item.type === type;
  });

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      ${createHeaderEditingForm(dataForPoint, dataAboutDestinations, externalData)}
      <section class="event__details">
        ${(allOffers.offers.length === 0) ? `` : createOffersEditingForm(dataForPoint, dataAboutOffers)}
        ${(dataForPoint.destination) ? createDestinationEditingForm(dataForPoint) : ``}
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

    this._flatpickrStart = null;
    this._flatpickrEnd = null;
    this._submitHandler = null;
    this._deleteButtonClickHandler = null;

    applyFlatpickrStart(this._flatpickrStart, this.getElement(), this._editForm, this._flatpickrEnd);
    applyFlatpickrEnd(this._flatpickrEnd, this.getElement(), this._editForm, this._flatpickrStart);
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditingFormTemplate(this._editForm,
        this._destinations, this._dataAboutOffers, this._externalData);
  }

  removeElement() {
    if (this._flatpickrStart) {
      this._flatpickrStart.destroy();
      this._flatpickrStart = null;
    }

    if (this._flatpickrEnd) {
      this._flatpickrEnd.destroy();
      this._flatpickrEnd = null;
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
    applyFlatpickrStart(this._flatpickrStart, this.getElement(), this._editForm, this._flatpickrEnd);
    applyFlatpickrEnd(this._flatpickrEnd, this.getElement(), this._editForm, this._flatpickrStart);
  }

  reset() {
    this._editForm.destination = this._defaultEditForm.destination;
    this._editForm.type = this._defaultEditForm.type;
    this._editForm.basePrice = this._defaultEditForm.basePrice;
    this._editForm.isFavorite = this._defaultEditForm.isFavorite;
    this._editForm.dateFrom = this._defaultEditForm.dateFrom;
    this._editForm.dateTo = this._defaultEditForm.dateTo;
    this._editForm.offers = this._defaultEditForm.offers;
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
      this._editForm.destination = null;

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

    const offersContainer = element.querySelector(`.event__available-offers`);
    if (offersContainer) {
      offersContainer.addEventListener(`change`, (evt) => {
        const id = evt.target.id;
        const label = element.querySelector(`label[for = ${id}]`);
        const title = label.querySelector(`span`).textContent;
        const actualOffers = this._dataAboutOffers.find((item) => {
          return item.type === this._editForm.type;
        });

        const currentOffer = actualOffers.offers.find((offer) => {
          return offer.title === title;
        });

        let isAddOffer = false;
        this._editForm.offers.forEach((offer) => {
          if (offer.title === title) {
            isAddOffer = true;
          }
        });
        if (isAddOffer) {
          this._editForm.offers = this._editForm.offers.filter((offer) => {
            return offer.title !== title;
          });
        } else {
          this._editForm.offers = [].concat(this._editForm.offers, currentOffer);
        }
        this.rerender();
      });
    }
  }
}
