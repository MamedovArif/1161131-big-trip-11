const generateOffers = (offer) => {
  const essence = offer.title.toLowerCase().split(` `).join(`-`);
  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${essence}-1"
      type="checkbox" name="event-offer-${essence}" ${(Math.random() > 0.6) ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${essence}-1">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`
  );
};

export const createOffersEditingForm = (object) => {
  const {offers} = object;

  if (offers.length === 0) {
    return ``;
  }

  let offersList = [];
  for (let i = 0; i < offers.length; i++) {
    offersList.push(generateOffers(offers[i]));
  }

  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offersList.join(`\n`)}
      </div>
    </section>`
  );
};

