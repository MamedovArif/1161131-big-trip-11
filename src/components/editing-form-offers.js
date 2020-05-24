const generateOffers = (offer, isSelect) => {
  const {title, price} = offer;
  const words = title.split(` `);
  const validWords = words.map((word) => {
    const speech = word.toLowerCase();
    const validWord = speech.split(``).filter((letter) => {
      return (letter !== `'` && letter !== `,`);
    });
    const validId = validWord.join(``);
    return validId;
  });
  const finishSelector = validWords.join(`-`);
  const checked = (isSelect) ? `checked` : ``;
  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox visually-hidden" id="event-offer-${finishSelector}-1"
      type="checkbox" name="event-offer-${finishSelector}" ${checked} value="${isSelect}">
      <label class="event__offer-label" for="event-offer-${finishSelector}-1">
        <span class="event__offer-title">${title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
};

export const createOffersEditingForm = (dataForPoint, dataAboutOffers) => {
  const {offers, type} = dataForPoint;
  const actualOffers = dataAboutOffers.find((item) => {
    return item.type === type;
  });
  let selected = [];
  const allTitles = actualOffers.offers.map((item) => item.title);

  if (offers.length === 0) {
    selected = new Array(actualOffers.offers.length).fill(false);
  } else {
    const titles = offers.map((it) => it.title);
    for (let i = 0; i < allTitles.length; i++) {
      selected.push(titles.includes(allTitles[i]));
    }
  }
  const offersList = [];
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
