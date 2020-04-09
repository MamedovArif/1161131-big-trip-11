const types = [`Taxi`, `Bus`, `Train`, `Ship`,
  `Transport`, `Drive`, `Flight`, `Check-in`, `Sightseeing`, `Restaurant`];

const cities = [`Amsterdam`, `London`, `Brussel`];

const option = {
  taxi: {
    offer: [`Order Uber`, `Order Yandex`],
    cost: [20, 25],
    pretext: `to`,
  },
  bus: {
    offer: [`Choose seats`, `Add luggage`],
    cost: [5, 10],
    pretext: `to`,
  },
  train: {
    offer: [`Travel by train`, `Order tea`],
    cost: [40, 80],
    pretext: `to`,
  },
  ship: {
    offer: [`Travel by ship`, `Travel by boat`],
    cost: [287, 346],
    pretext: `to`,
  },
  transport: {
    offer: [`Travel by transport`, `Travel by walking`],
    cost: [113, 20],
    pretext: `to`,
  },
  drive: {
    offer: [`Rent a car`, `Rent a motorcycle`],
    cost: [200, 350],
    pretext: `to`,
  },
  flight: {
    essence: [`luggage`, `comfort`, `dinner`, `parachute`],
    offer: [`Add luggage`, `Switch to comfort class`, `Add dinner`, `Jump with a parachute`],
    cost: [30, 100, 70, 150],
    pretext: `to`,
  },
  'check-in': {
    offer: [`Add breakfast`, `Add dinner`],
    cost: [50, 80],
    pretext: `in`,
  },
  sightseeing: {
    offer: [`Lucnch in city`, `Book tickets`],
    cost: [30, 40],
    pretext: `in`,
  },
  restaurant: {
    offer: [`Add meal`, `Order coffee`],
    cost: [15, 30],
    pretext: `in`,
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
`In rutrum ac purus sit amet tempus.`];

export const defaultData = {
  type: `Flight`,
  city: `Saint Petersburg`,
  timeBegin: new Date(),
  timeEnd: new Date(),
  price: ``,
  options: option.flight,
  destination: `The city was founded by Tsar Peter the Great on 27 `,
  photos: ``,
}

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);
  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomDate = () => {
  const targetDate = new Date();
  const diffValue = getRandomIntegerNumber(0, 120);

  targetDate.setMinutes(targetDate.getMinutes() + diffValue);

  return targetDate;
};

const generatePoint = () => {
  let destination = new Set();
  let photos = [];

  for (let i = 0; i < getRandomIntegerNumber(1, 5); i++) {
    destination.add(getRandomArrayItem(destinations));
    photos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }

  const obj = {
    type: getRandomArrayItem(types),
    city: getRandomArrayItem(cities),
    timeBegin: new Date(),
    price: getRandomIntegerNumber(20, 400),
    destination: destination,
    photos: photos,
  };

  obj.timeEnd = getRandomDate(obj.timeBegin);
  obj.options = option[(obj.type).toLowerCase()];

  return obj;
}

const generatePoints = (count) => {
  return new Array(count).fill(``).map(generatePoint);
}

export {getRandomArrayItem, generatePoints, getRandomIntegerNumber};
