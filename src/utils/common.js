import moment from "moment";

const MILLISECONDS_IN_SECOND = 1000;
const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;

export const upperFirstElement = (string) => {
  const str = string[0].toUpperCase() + string.slice(1);
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
  let minutes = (end - begin) / (MILLISECONDS_IN_SECOND * MINUTES_IN_HOUR);
  let days;
  let hours;
  let result = ``;
  if (minutes >= HOURS_IN_DAY * MINUTES_IN_HOUR) {
    days = castTimeFormat(Math.floor(minutes / (MINUTES_IN_HOUR * HOURS_IN_DAY)));
    minutes = minutes % (MINUTES_IN_HOUR * HOURS_IN_DAY);
    result += `${days}D `;
  }
  if (minutes >= MINUTES_IN_HOUR) {
    hours = castTimeFormat(Math.floor(minutes / MINUTES_IN_HOUR));
    minutes = minutes % MINUTES_IN_HOUR;
    result += `${hours}H `;
  }
  minutes = parseInt(castTimeFormat(minutes), 10);
  result += `${minutes}M`;
  return result;
};
