const types = [`Taxi`, `Bus`, `Train`, `Ship`,
  `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeng`, `Restaurant`];

const cities = [`Amsterdam`, `London`, `Brussel`];

const option = {
  taxi: {
    offer: `Order Uber`,
    cost: 20,
  },
  bus: {
    offer: `Choose seats`,
    cost: 5,
  },
  train: {
    offer: `Travel by train`,
    cost: 40,
  },
  ship: {
    offer: `Travel by ship`,
    cost: 287,
  },
  transport: {
    offer: `Travel by transport`,
    cost: 113,
  },
  drive: {
    offer: `Rent a car`,
    cost: 200
  },
  flight: {
    offer: [`Add luggage`, `Switch to comfort class`],
    cost: [30, 100],
  },
  'check-in': {
    offer: `Add breakfast`,
    cost: 50,
  },
  sightseeng: {
    offer: [`Lucnch in city`, `Book tickets`],
    cost: [30, 40],
  },
  restaurant: {
    offer: `Add meal`,
    cost: 15,
  },
}

const destinations = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
`Cras aliquet varius magna, non porta ligula feugiat eget.`,
`Fusce tristique felis at fermentum pharetra.`,
`Aliquam id orci ut lectus varius viverra.`,
`Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
`Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
`Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
`Sed sed nisi sed augue convallis suscipit in sed felis.`,
`Aliquam erat volutpat.`,
`Nunc fermentum tortor ac porta dapibus.`,
`In rutrum ac purus sit amet tempus.`]

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);
  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const generatePoint = () => {
  let destination = ``;
  let photos = [];

  for (let i = 0; i < getRandomIntegerNumber(1, 5); i++) {
    destination += ` ${getRandomArrayItem(destinations)}`;
    photos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }

  const obj = {
    type: getRandomArrayItem(types),
    city: getRandomArrayItem(cities),
    timeBegin: new Date(),
    timeEnd: new Date(),
    price: getRandomIntegerNumber(20, 400),
    destination: destination,
    photos: photos,
  };
  console.log(obj.type);
  obj.options = option[(obj.type).toLowerCase()];
  console.log(obj);

  return obj;
}

const generatePoints = (count) => {
  return new Array(count).fill(``).map(generatePoint);
}

export {generatePoints};


// let event = ;
