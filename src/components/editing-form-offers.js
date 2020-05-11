const generateOffers = (offer, isSelect) => {
  const {title, price} = offer;
  const essence = title.toLowerCase().split(` `).join(`-`);
  const checked = (isSelect) ? `checked` : ``;
  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="event-offer-${essence}-1"
      type="checkbox" name="event-offer-${essence}" ${checked} value="${isSelect}">
      <label class="event__offer-label" for="event-offer-${essence}-1">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

export const createOffersEditingForm = (object, dataAboutOffers) => {
  const {offers, type} = object;
  const actualOffers = dataAboutOffers.find((item) => {
    return item.type === type;
  });
  let selected = [];
  let allTitles = actualOffers.offers.map((item) => item.title);
  let titles = offers.map((it) => it.title);
  for (let i = 0; i < allTitles.length; i++) {
    selected.push(titles.includes(allTitles[i]));
  }
  let offersList = [];
  for (let j = 0; j < actualOffers.offers.length; j++) {
    offersList.push(generateOffers(actualOffers.offers[j], selected[j]));
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
