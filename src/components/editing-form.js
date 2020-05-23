import {createHeaderEditingForm} from './editing-form-header.js';
import {createOffersEditingForm} from './editing-form-offers.js';
import {createDestinationEditingForm} from './editing-form-destination.js';
import AbstractSmartComponent from "./abstract-smart-component.js";
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

const getTime = (field) => {
  const stringDates = field.value.split(` `);
  const dateValues = stringDates[0].split(`.`);
  const timeValues = stringDates[1].split(`:`);
  const currentDate = new Date('20' + dateValues[2], Number(dateValues[1]) - 1, dateValues[0],
      timeValues[0], timeValues[1]);
  return currentDate;
}

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

    this._applyFlatpickrStart();
    this._applyFlatpickrEnd();
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
    this._applyFlatpickrStart();
    this._applyFlatpickrEnd();
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

  _applyFlatpickrStart() {
    if (this._flatpickrStart) {
      this._flatpickrStart.destroy();
      this._flatpickrStart = null;
    }

    // if (this._flatpickrEnd) {
    //   this._flatpickrEnd.destroy();
    //   this._flatpickrEnd = null;
    // }

    const dateBegin = this.getElement()
        .querySelector(`input[name = event-start-time]`);
    const dateEnd = this.getElement()
        .querySelector(`input[name = event-end-time]`);

    const currentTo = getTime(dateEnd);
    console.log(currentTo);

    this._flatpickrStart = flatpickr(dateBegin, {
      altInput: true,
      allowInput: false,
      altFormat: `d.m.y H:i`,
      maxDate: currentTo,
      time_24hr: true,
      disableMobile: true,
      dateFormat: `Z`,
      enableTime: true,
      defaultDate: this._editForm.dateFrom || `today`,
    });

    // this._flatpickrEnd = flatpickr(dateEnd, {
    //   altInput: true,
    //   allowInput: false,
    //   altFormat: `d.m.y H:i`,
    //   //minDate: dateBegin.value,
    //   time_24hr: true,
    //   disableMobile: true,
    //   onClose: this._applyFlatpickrStart(selectedDates);
    //   dateFormat: `Z`,
    //   enableTime: true,
    //   defaultDate: this._editForm.dateTo || `today`,
    // });
  }

  _applyFlatpickrEnd() {
    if (this._flatpickrEnd) {
      this._flatpickrEnd.destroy();
      this._flatpickrEnd = null;
    }

    const dateBegin = this.getElement()
        .querySelector(`input[name = event-start-time]`);
    const dateEnd = this.getElement()
        .querySelector(`input[name = event-end-time]`);

    // const currentFrom = getTime(dateBegin);

    // console.log(dateBegin.value);

    this._flatpickrEnd = flatpickr(dateEnd, {
      altInput: true,
      allowInput: false,
      altFormat: `d.m.y H:i`,
      //minDate: dateBegin.value,
      time_24hr: true,
      disableMobile: true,
      onClose: function() {
        console.log('fufuf');
        this._applyFlatpickrStart();
      },
      dateFormat: `Z`,
      enableTime: true,
      defaultDate: this._editForm.dateTo || `today`,
    });
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




    // element.querySelector(`input[name = event-end-time]`).addEventListener(`blur`, (evt) => {
    //   console.log('het');
    //   this._applyFlatpickrStart();
    // });



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
