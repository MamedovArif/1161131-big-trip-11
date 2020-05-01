import {SortType} from "../const.js";
import {durationOfPoint} from "./common.js";

const getSortOnEvent = (allPoints) => {
  return allPoints;
};

const getSortOnTime = (allPoints) => {
  let points = [];
  allPoints.map((littleArray) => {
    points = points.concat(littleArray);
  });
  points.sort((a, b) => {
    const durationA = durationOfPoint(a.timeBegin, a.timeEnd);
    const durationB = durationOfPoint(b.timeBegin, b.timeEnd);
    return durationB - durationA;
  });
  return points;
};

const getSortOnPrice = (allPoints) => {
  let points = [];
  allPoints.map((littleArray) => {
    points = points.concat(littleArray);
  });
  points.sort((a, b) => {
    return a.price - b.price;
  });
  return points;
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
