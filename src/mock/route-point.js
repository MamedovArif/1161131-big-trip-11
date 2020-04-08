const types = [`Taxi`, `Bus`, `Train`, `Ship`,
  `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];

const cities = [`Amsterdam`, `London`, `Brussel`];

const option = {
  taxi: {
    offer: [`Order Uber`, `Order Yandex`],
    cost: [20, 25],
  },
  bus: {
    offer: [`Choose seats`, `Add luggage`],
    cost: [5, 10],
  },
  train: {
    offer: [`Travel by train`, `Order tea`],
    cost: [40, 80],
  },
  ship: {
    offer: [`Travel by ship`, `Travel by boat`],
    cost: [287, ],
  },
  transport: {
    offer: [`Travel by transport`, `Travel by walking`],
    cost: [113, 20],
  },
  drive: {
    offer: [`Rent a car`, `Rent a motorcycle`],
    cost: [200, 350],
  },
  flight: {
    offer: [`Add luggage`, `Switch to comfort class`],
    cost: [30, 100],
  },
  'check-in': {
    offer: [`Add breakfast`, `Add dinner`],
    cost: [50, 80],
  },
  sightseeing: {
    offer: [`Lucnch in city`, `Book tickets`],
    cost: [30, 40],
  },
  restaurant: {
    offer: [`Add meal`, `Order coffee`],
    cost: [15, 30],
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

  obj.options = option[(obj.type).toLowerCase()];

  return obj;
}

const generatePoints = (count) => {
  return new Array(count).fill(``).map(generatePoint);
}

export {getRandomArrayItem, generatePoints, getRandomIntegerNumber};
