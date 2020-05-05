//const cities = [`Amsterdam`, `London`, `Brussel`];

// export const option = {
//   'taxi': {
//     essence: [`uber`, `yandex`],
//     offer: [`Order Uber`, `Order Yandex`],
//     cost: [20, 25],
//     pretext: `to`,
//   },
//   'bus': {
//     essence: [`seats`, `luggage`],
//     offer: [`Choose seats`, `Add luggage`],
//     cost: [5, 10],
//     pretext: `to`,
//   },
//   'train': {
//     essence: [`train`, `tea`],
//     offer: [`Travel by train`, `Order tea`],
//     cost: [40, 80],
//     pretext: `to`,
//   },
//   'ship': {
//     essence: [`ship`, `boat`],
//     offer: [`Travel by ship`, `Travel by boat`],
//     cost: [287, 346],
//     pretext: `to`,
//   },
//   'transport': {
//     essence: [`tansport`, `walking`],
//     offer: [`Travel by transport`, `Travel by walking`],
//     cost: [113, 20],
//     pretext: `to`,
//   },
//   'drive': {
//     essence: [`car`, `motorcycle`],
//     offer: [`Rent a car`, `Rent a motorcycle`],
//     cost: [200, 350],
//     pretext: `to`,
//   },
//   'flight': {
//     essence: [`luggage`, `comfort`, `dinner`, `parachute`],
//     offer: [`Add luggage`, `Switch to comfort class`, `Add dinner`, `Jump with a parachute`],
//     cost: [30, 100, 70, 150],
//     pretext: `to`,
//   },
//   'check-in': {
//     essence: [`breakfast`, `dinner`],
//     offer: [`Add breakfast`, `Add dinner`],
//     cost: [50, 80],
//     pretext: `in`,
//   },
//   'sightseeing': {
//     essence: [`lucnh`, `tickets`],
//     offer: [`Lucnch in city`, `Book tickets`],
//     cost: [30, 40],
//     pretext: `in`,
//   },
//   'restaurant': {
//     essence: [`meal`, `coffee`],
//     offer: [`Add meal`, `Order coffee`],
//     cost: [15, 30],
//     pretext: `in`,
//   },
// };

// const destinations = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
//   `Cras aliquet varius magna, non porta ligula feugiat eget.`,
//   `Fusce tristique felis at fermentum pharetra.`,
//   `Aliquam id orci ut lectus varius viverra.`,
//   `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
//   `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
//   `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
//   `Sed sed nisi sed augue convallis suscipit in sed felis.`,
//   `Aliquam erat volutpat.`,
//   `Nunc fermentum tortor ac porta dapibus.`,
//   `In rutrum ac purus sit amet tempus.`];

// export const defaultData = {
//   type: `Flight`,
//   city: `Saint Petersburg`,
//   timeBegin: new Date(),
//   timeEnd: new Date(),
//   price: ``,
//   options: option.flight,
//   destination: [`The city was founded by Tsar Peter the Great on 27`],
//   photos: [`http://picsum.photos/248/152?r=${Math.random()}`,
//     `http://picsum.photos/248/152?r=${Math.random()}`],
//   isFavorite: false,
//   placeholder: ``,
// };

const destinations = [
  {
    "description": "Brussel, is a beautiful city, a true asian pearl, with crowded streets.",
    "name": `Brussel`,
    "pictures": [
      {
        "src": `http://picsum.photos/248/152?r=${Math.random()}`,
        "description": "Brussel parliament building"
      },
      {
        "src": `http://picsum.photos/248/152?r=${Math.random()}`,
        "description": "Brussel parliament building"
      },
      {
        "src": `http://picsum.photos/248/152?r=${Math.random()}`,
        "description": "Brussel parliament building"
      }
    ]
  },
  {
    "description": "Amsterdam became one of the most important ports in the world " +
        "in the Dutch Golden Age of the 17th century and became the leading centre for finance and trade.",
    "name": `Amsterdam`,
    "pictures": [
      {
        "src": `http://picsum.photos/248/152?r=${Math.random()}`,
        "description": "Amsterdam parliament building"
      },
      {
        "src": `http://picsum.photos/248/152?r=${Math.random()}`,
        "description": "Amsterdam parliament building"
      }
    ]
  },
  {
    "description": "London exerts a considerable impact upon the arts, " +
        "commerce, education, entertainment, fashion, finance, healthcare, " +
        "media, professional services, research and development, tourism and " +
        "transportation.London ranks 26th out of 300 major cities for economic performance.",
    "name": `London`,
    "pictures": [
      {
        "src": `http://picsum.photos/248/152?r=${Math.random()}`,
        "description": "London parliament building"
      }
    ]
  },
];

const offers = {
  'taxi': [
      {
        title: `Order Uber`,
        price: 20,
      },
      {
        title: `Order Yandex`,
        price: 30,
      },
    ],
  'bus': [
      {
        title: `Choose seats`,
        price: 100,
      },
      {
        title: `Add luggage`,
        price: 50,
      },
    ],
  'train': [
      {
        title: `Travel by train`,
        price: 78,
      },
      {
      title: `Order tea`,
      price: 5,
      },
    ],
  'ship': [],
  'transport': [],
  'drive': [],
  'flight': [
      {
        "title": "Choose meal",
        "price": 180,
      },
      {
        "title": "Upgrade to comfort class",
        "price": 50,
      },
    ],
  'check-in': [
      {
        title: `Add breakfast`,
        price: 57,
      },
      {
        title: `Add dinner`,
        price: 60,
      },
    ],
  'sightseeing': [
      {
        title: `Lucnch in city`,
        price: 150,
      },
      {
        title: `Book tickets`,
        price: 600,
      },
    ],
  'restaurant': [
      {
        title: `Add meal`,
        price: 34,
      },
      {
        title: `Order coffee`,
        price: 456,
      },
    ],
}

const types = ["taxi", "bus", "train", "ship", "transport", "drive",
 "flight", "check-in", "sightseeing", "restaurant"];

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);
  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomTimeEnd = (targetDate) => {
  const totalDate = new Date(targetDate.getFullYear(), targetDate.getMonth(),
      targetDate.getDate(), targetDate.getHours(), targetDate.getMinutes());

  const diffValue = getRandomIntegerNumber(0, 120);
  totalDate.setMinutes(totalDate.getMinutes() + diffValue);
  return totalDate;
};

const getRandomDate = () => {
  let date = new Date();
  let diff = getRandomIntegerNumber(0, 3);
  if (Math.random() * 10 > 5) {
    diff = diff * (-1);
  }
  date.setDate(date.getDate() + diff);
  date = getRandomTimeEnd(date);
  return date;
};

export const generateDate = () => {
  return {
    date: getRandomDate(),
  };
};

const generatePoint = () => {
  //let destination = new Set();
  // const photos = [];

  // for (let i = 0; i < getRandomIntegerNumber(1, 5); i++) {
  //   destination.add(getRandomArrayItem(destinations));
  //   photos.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  // }

  const obj = {
  "basePrice": getRandomIntegerNumber(300, 700),
  "dateFrom": getRandomDate(),
  "destination": getRandomArrayItem(destinations),
  "id": String(new Date() + Math.random()),
  "isFavorite": (Math.random() < 0.4) ? true : false,
  "type": getRandomArrayItem(types),
  }

  obj.dateTo = getRandomTimeEnd(obj[`dateFrom`]);
  obj.offers = offers[obj.type];

  // {
  //   id: String(new Date() + Math.random()),
  //   type: getRandomArrayItem(types),
  //   city: getRandomArrayItem(cities),
  //   price: getRandomIntegerNumber(20, 400),
  //   destination: [...destination],
  //   photos: [...photos],
  //   isFavorite: (Math.random() < 0.4) ? true : false,
  //   placeholder: ``,
  //   timeBegin: getRandomDate(),
  // };
  // obj.timeEnd = getRandomTimeEnd(obj.timeBegin);
  // obj.options = option[(obj.type).toLowerCase()];

  return obj;
};

const generatePoints = (count) => {
  return new Array(count).fill(``).map(() => {
    return generatePoint();
  });
};

export {getRandomArrayItem, generatePoints, getRandomIntegerNumber};
