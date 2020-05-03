import {createHeaderEditingForm} from './editing-form-header.js';
import {createOffersEditingForm} from './editing-form-offers.js';
import {createDestinationEditingForm} from './editing-form-destination.js';
import AbstractSmartComponent from "./abstract-smart-component.js";
import {option} from "../mock/route-point.js";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const createEditingFormTemplate = (object) => {
  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      ${createHeaderEditingForm(object)}
      <section class="event__details">
        ${createOffersEditingForm(object)}
        <section class="event__section  event__section--destination">
          ${createDestinationEditingForm(object)}
        </section>
      </section>
    </form>`
  );
};

// const parseFormData = (formData) => { /////////////////
//   return {
//     id: String(new Date() + Math.random()),
//     type: formData.get(``),
//     city: formData.get(`event-destination`),
//     price: formData.get(`event-price`),
//     destination: [],
//     photos: [],
//     isFavorite: (Math.random() < 0.4) ? true : false,
//     placeholder: ``,
//     timeBegin: formData.get(`event-start-time`),
//     timeEnd: formData.get(`event-end-time`)
//     options: option[(obj.type).toLowerCase()];
//   }
// }

export default class FormForEdit extends AbstractSmartComponent {
  constructor(editForm) {
    super();
    this._editForm = Object.assign({}, editForm);
    this._defaultEditForm = editForm;

    this._flatpickr = null;
    this._submitHandler = null;
    this._deleteButtonClickHandler = null; //////////

    this._applyFlatpickr();
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditingFormTemplate(this._editForm);
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
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler); /////
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
    this._editForm.options = option[(this._defaultEditForm.type).toLowerCase()];
    this.rerender();
  }

  getData() { //////////
    const form = this.getElement().querySelector(`.trip-events__item`);
    const formData = new FormData(form);

    return parseFormData(formData);
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setFavoriteChangeHandler(handler) {
    this.getElement().querySelector(`input[name = event-favorite]`)
        .addEventListener(`change`, handler);
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
      allowInput: true,
      defaultDate: this._editForm.timeBegin || `today`,
    });
    const dateEnd = this.getElement()
        .querySelector(`input[name = event-end-time]`);
    this._flatpickr = flatpickr(dateEnd, {
      altInput: true,
      allowInput: true,
      defaultDate: this._editForm.timeEnd || `today`,
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();
    element.querySelector(`input[name = event-destination]`)
        .addEventListener(`input`, (evt) => {
          this._editForm.city = evt.target.value;
          this._editForm.destination = [`condimentum sed nibh vitae, sodales`];
          this.rerender();
        });
    element.querySelector(`.event__type-group`).addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `LABEL`) {
        return;
      }
      this._editForm.type = evt.target.textContent;
      this._editForm.city = ``;
      this._editForm.placeholder = `Moscow`;

      this._editForm.options = option[(this._editForm.type).toLowerCase()];
      this.rerender();
    });

  }
}
