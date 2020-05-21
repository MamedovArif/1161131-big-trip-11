import {FilterType} from "../const.js";

export const getFilteredPoints = (points, filterType) => {
  let dataOfPoints;

  switch (filterType) {
    case FilterType.FUTURE:
      dataOfPoints = points.map((oneDayOfPoints) => {
        return oneDayOfPoints.filter((item) => item.dateFrom > new Date());
      });
      dataOfPoints = dataOfPoints.filter((oneDayOfPoints) => {
        return oneDayOfPoints.length !== 0;
      });
      break;
    case FilterType.PAST:
      dataOfPoints = points.map((oneDayOfPoints) => {
        return oneDayOfPoints.filter((item) => item.dateFrom < new Date());
      });
      dataOfPoints = dataOfPoints.filter((oneDayOfPoints) => {
        return oneDayOfPoints.length !== 0;
      });
      break;
    case FilterType.EVERYTHING:
      dataOfPoints = points;
      break;
    default:
      throw new Error(`функция getFilteredPoints принимает неверные аргументы`);
  }
  return dataOfPoints;
};
