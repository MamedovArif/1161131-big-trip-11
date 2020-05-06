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

const cities = [`Amsterdam`, `London`, `Brussel`];

export const destinations = {
  'noChoose': {
      "description": ``,
      "name": ``,
      "pictures": []
  },
  'Brussel': {
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
  'Amsterdam': {
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
  'London': {
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
};

export const offers = {
  'taxi': [
      {
        "title": "Choose meal",
        "price": 180
      }, {
        "title": "Upgrade to comfort class",
        "price": 50
      }
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
  const obj = {
  "basePrice": getRandomIntegerNumber(300, 700),
  "dateFrom": getRandomDate(),
  "destination": destinations[getRandomArrayItem(cities)],
  "id": String(new Date() + Math.random()),
  "isFavorite": (Math.random() < 0.4) ? true : false,
  "type": getRandomArrayItem(types),
  }

  obj.dateTo = getRandomTimeEnd(obj[`dateFrom`]);
  obj.offers = offers[obj.type];
  return obj;
};

const generatePoints = (count) => {
  return new Array(count).fill(``).map(() => {
    return generatePoint();
  });
};

export {getRandomArrayItem, generatePoints, getRandomIntegerNumber};
