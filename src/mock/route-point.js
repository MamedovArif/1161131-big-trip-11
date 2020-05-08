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

const cities = [`Amsterdam`, `London`, `Brussel`, `Saint Petersburg`];

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
          "src": `https://i.picsum.photos/id/630/248/152.jpg`,
          "description": "Brussel parliament building"
        },
        {
          "src": `https://i.picsum.photos/id/630/248/152.jpg`,
          "description": "Brussel parliament building"
        },
        {
          "src": `https://i.picsum.photos/id/630/248/152.jpg`,
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
          "src": `https://i.picsum.photos/id/835/248/152.jpg`,
          "description": "Amsterdam parliament building"
        },
        {
          "src": `https://i.picsum.photos/id/835/248/152.jpg`,
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
      "pictures": [ // http://picsum.photos/248/152?r=${Math.random()}
        {
          "src": `https://i.picsum.photos/id/1018/248/152.jpg`,
          "description": "London parliament building"
        }
      ]
    },
  'Saint Petersburg': {
    "description": "Saint Petersburg is a city situated on the Neva River, " +
        "at the head of the Gulf of Finland on the Baltic Sea.",
    "name": `Saint Petersburg`,
    "pictures": [
      {
        "src": `https://i.picsum.photos/id/834/248/152.jpg`,
        "description": "London parliament building"
      }
    ]
  }
};

export const offers = {
  'taxi': [
      {
        title: "Choose meal",
        price: 180,
        isChecked: false,
      }, {
        title: "Upgrade to comfort class",
        price: 50,
        isChecked: false,
      }
    ],
  'bus': [
      {
        title: `Choose seats`,
        price: 100,
        isChecked: false,
      },
      {
        title: `Add luggage`,
        price: 50,
        isChecked: false,
      },
    ],
  'train': [
      {
        title: `Travel by train`,
        price: 78,
        isChecked: false,
      },
      {
      title: `Order tea`,
      price: 5,
      isChecked: false,
      },
    ],
  'ship': [],
  'transport': [],
  'drive': [],
  'flight': [
      {
        title: "Choose meal",
        price: 180,
        isChecked: false,
      },
      {
        title: "Upgrade to comfort class",
        price: 50,
        isChecked: false,
      },
    ],
  'check-in': [
      {
        title: `Add breakfast`,
        price: 57,
        isChecked: false,
      },
      {
        title: `Add dinner`,
        price: 60,
        isChecked: false,
      },
    ],
  'sightseeing': [
      {
        title: `Lucnch in city`,
        price: 150,
        isChecked: false,
      },
      {
        title: `Book tickets`,
        price: 600,
        isChecked: false,
      },
    ],
  'restaurant': [
      {
        title: `Add meal`,
        price: 34,
        isChecked: false,
      },
      {
        title: `Order coffee`,
        price: 456,
        isChecked: false,
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
