const generateOffers = (offer, price) => {
  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>
      <label class="event__offer-label" for="event-offer-luggage-1">
        <span class="event__offer-title">${offer}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`
  )
}

export const createOffersEditingForm = (object) => {

  const {options} = object;

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${generateOffers(options.offer, options.cost)}
        ${generateOffers(options.offer, options.cost)}
        ${generateOffers(options.offer, options.cost)}
      </div>
    </section>`
  )
};

