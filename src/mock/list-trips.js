import {getRandomIntegerNumber} from './route-point.js'

export const week = [{
  date: new Date(2020, 2, 9),
  counter: 1,
}, {
  date: new Date(2020, 2, 12),
  counter: 2,
}, {
  date: new Date(2020, 2, 13),
  counter: 3,
}];

const getRandomDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + getRandomIntegerNumber(0, 7));
  return date;
}

export const generateDate = (index) => {
  return {
    date: getRandomDate(),
    counter: index + 1,
  }
}

// const scheduledDays = [];
//   let randomNumber = getRandomIntegerNumber(0, 7);

//   for (let i = 0; i <= randomNumber; i++) {
//     scheduledDays.push(generateDays());
//   };
