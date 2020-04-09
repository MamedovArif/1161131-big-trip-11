export const createDestinationEditingForm = (object) => {
  const {destination, photos} = object;

  let combinationPhotos = [];
  for (let i = 0; i < photos.length; i++) {
    combinationPhotos.push(`<img class="event__photo" src="${photos[i]}" alt="Event photo">`);
  }

  return (
    `<h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${combinationPhotos.join(`\n`)}
      </div>
    </div>`
  );
}
