import {SortType} from "../const.js";
import {durationOfPoint} from "./common.js";

const getSortOnEvent = (allPoints) => {
  return allPoints;
};

const getSortOnTime = (allPoints) => {
  let points = [];
  const wrapperPoints = [];
  allPoints.map((oneDayOfPoints) => {
    points = points.concat(oneDayOfPoints);
  });
  points.sort((a, b) => {
    const durationA = durationOfPoint(a.dateFrom, a.dateTo);
    const durationB = durationOfPoint(b.dateFrom, b.dateTo);
    return durationA - durationB;
  });
  wrapperPoints.push(points);
  return wrapperPoints;
};

const getSortOnPrice = (allPoints) => {
  let points = [];
  const wrapperPoints = [];
  allPoints.map((oneDayOfPoints) => {
    points = points.concat(oneDayOfPoints);
  });
  points.sort((a, b) => {
    return b.basePrice - a.basePrice;
  });
  wrapperPoints.push(points);
  return wrapperPoints;
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
      throw new Error(`getPointsBySort принимает неверный тип`);
  }
};
