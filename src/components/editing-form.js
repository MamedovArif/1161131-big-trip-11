import {createHeaderEditingForm, } from './editing-form-header.js';
import {createOffersEditingForm} from './editing-form-offers.js';
import {createDestinationEditingForm} from './editing-form-destination.js';

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

export {createEditingFormTemplate};
