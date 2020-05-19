import moment from "moment";

export const upperFirstElement = (string) => {
  let str = string[0].toUpperCase() + string.slice(1);
  return str;
};

export const durationOfPoint = (dateA, dateB) => {
  const a = moment(dateA);
  const b = moment(dateB);
  return a.diff(b, `minutes`);
};

export const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  return moment(date).format(`HH:mm`);
};

export const formatTimeDate = (date) => {
  return moment(date).format(`DD.MM.YY`);
};

export const diffTime = (begin, end) => {
  let minutes = (end - begin) / (1000 * 60);
  let days;
  let hours;
  let result = ``;
  if (minutes >= 24 * 60) {
    days = castTimeFormat(Math.floor(minutes / (60 * 24)));
    minutes = minutes % (60 * 24);
    result += `${days}D `;
  }
  if (minutes >= 60) {
    hours = castTimeFormat(Math.floor(minutes / 60));
    minutes = minutes % 60;
    result += `${hours}H `;
  }
  minutes = parseInt(castTimeFormat(minutes), 10);
  result += `${minutes}M`;
  return result;
};
