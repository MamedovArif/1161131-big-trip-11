import {getRandomArrayItem} from '../mock/route-point.js'

const generateOffers = (offer, price, essence) => {
  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${essence}-1"
      type="checkbox" name="event-offer-${essence}" ${(Math.random() > 0.6) ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${essence}-1">
        <span class="event__offer-title">${offer}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`
  )
}

export const createOffersEditingForm = (object) => {

  const {options} = object;

  let offersList = [];
  for (let i = 0; i < options.offer.length; i++) {
    offersList.push(generateOffers(options.offer[i], options.cost[i], options.essence[i]));
  }

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offersList.join(`\n`)}
      </div>
    </section>`
  )
};

