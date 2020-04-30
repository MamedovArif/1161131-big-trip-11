import {SortType} from "../const.js";

const getSortOnEvent = (allPoints) => {
  return allPoints;
};

export const durationOfPoint = (dateA, dateB) => {
  const a = moment(dateA);
  const b = moment(dateB);
  return a.diff(b, `minutes`);
};

const getSortOnTime = (allPoints) => {
  const points = [];
  allPoints.map((littleArray) => {
    points = points.concat(littleArray);
  });
  points.sort((a, b) => {
    const durationA = durationOfPoint(a.timeBegin, a.timeEnd);
    const durationB = durationOfPoint(b.timeBegin, b.timeEnd);
    return durationB - durationA;
  })
};

const getSortOnPrice = (allPoints) => {
  const points = [];
  allPoints.map((littleArray) => {
    points = points.concat(littleArray);
  });
  points.sort((a, b) => {
    return b.price - a.price;
  });
  console.log(points);
};

export const getPointsBySort = (points, sortType) => {
  switch (sortType) {
    case SortType.EVENT:
      return getSortOnEvent(points);
    case SortType.TIME:
      return getSortOnTime(points);
    case SortType.PRICE:
      return getSortOnPrice(points);
    default:
      throw new Error('getPointsBySort принимает неверный тип');
  }
  return points;
}
