import {createHeaderEditingForm} from './editing-form-header.js';
import {createOffersEditingForm} from './editing-form-offers.js';
import {createDestinationEditingForm} from './editing-form-destination.js';
import AbstractSmartComponent from "./abstract-smart-component.js";
import {option} from "../mock/route-point.js";

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

export default class FormForEdit extends AbstractSmartComponent {
  constructor(editForm) {
    super();
    this._editForm = Object.assign({}, editForm);
    this._defaultEditForm = editForm;

    this._submitHandler = null;
    this._subscribeOnEvents();
  }

  getTemplate() {
    return createEditingFormTemplate(this._editForm);
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  rerender() {
    super.rerender();
  }

  reset() {
    this._editForm.city = this._defaultEditForm.city;

    this._editForm.destination = this._defaultEditForm.destination;
    this._editForm.type = this._defaultEditForm.type;
    this._editForm.placeholder = this._defaultEditForm.placeholder;
    this._editForm.options = option[(this._defaultEditForm.type).toLowerCase()];
    this.rerender();
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setFavoriteChangeHandler(handler) {
    this.getElement().querySelector(`input[name = event-favorite]`)
        .addEventListener(`change`, handler);
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
