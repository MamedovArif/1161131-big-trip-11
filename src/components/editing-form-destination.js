export const createDestinationEditingForm = (object) => {
  const {destination} = object;
  const photos = destination.pictures;

  let combinationPhotos = [];
  if (photos.length === 0) {
    combinationPhotos = [];
  } else {
    for (let i = 0; i < photos.length; i++) {
      combinationPhotos.push(`<img class="event__photo" src="${photos[i].src}" alt="${photos[i].description}">`);
    }
  }

  return (
    `<h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${combinationPhotos.join(`\n`)}
      </div>
    </div>`
  );
};
