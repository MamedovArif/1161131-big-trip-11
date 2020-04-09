const createCostOfTripTemplate = (array) => {
  let sum = array.reduce((acc, item) => {
    return acc += item;
  }, 0);

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${sum}</span>
    </p>`
  );
};

export {createCostOfTripTemplate};
