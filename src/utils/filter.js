import {FilterType} from "../const.js";

export const getFilteredPoints = (points, filterType) => {
  let dataOfPoints;

  switch (filterType) {
    case FilterType.FUTURE:
      dataOfPoints = points.map((littleArray) => {
        return littleArray.filter((item) => item.dateFrom > new Date());
      });
      dataOfPoints = dataOfPoints.filter((littleArray) => {
        return littleArray.length !== 0;
      });
      break;
    case FilterType.PAST:
      dataOfPoints = points.map((littleArray) => {
        return littleArray.filter((item) => item.dateFrom < new Date());
      });
      dataOfPoints = dataOfPoints.filter((littleArray) => {
        return littleArray.length !== 0;
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
