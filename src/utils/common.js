import moment from "moment";

export const durationOfPoint = (dateA, dateB) => {
  const a = moment(dateA);
  const b = moment(dateB);
  return a.diff(b, `minutes`);
};

export const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  // const hours = castTimeFormat(date.getHours());
  // const minutes = castTimeFormat(date.getMinutes());
  // return `${hours}:${minutes}`;
  return moment(date).format(`hh:mm`);
};

export const formatTimeDate = (date) => {
  // const day = castTimeFormat(date.getDate());
  // const month = castTimeFormat(date.getMonth() + 1);
  // const year = String(date.getFullYear()).slice(-2);
  // return `${day}/${month}/${year}`;
  return moment(date).format(`DD.MM.YY`);
};

export const diffTime = (begin, end) => {
  // let minutes = (end - begin) / (1000 * 60);
  // let days;
  // let hours;
  // let result = ``;
  // if (minutes >= 24 * 60) {
  //   days = castTimeFormat(Math.floor(minutes / (60 * 24)));
  //   minutes = minutes % (60 * 24);
  //   result += `${days}D `;
  // }
  // if (minutes >= 60) {
  //   hours = castTimeFormat(Math.floor(minutes / 60));
  //   minutes = minutes % 60;
  //   result += `${hours}H `;
  // }
  // minutes = castTimeFormat(minutes);
  // result += `${minutes}M`;
  // return result;
  const dateEnd = moment(end);
  const dateBegin = moment(begin);

  const diffDay = dateEnd.diff(dateBegin, `days`);
  const diffHours = dateEnd.diff(dateBegin, `hours`);
  const diffMinutes = dateEnd.diff(dateBegin, `minutes`);

  const diffDayString = (diffDay > 0) ? `${diffDay}D` : ``;
  const diffHoursString = (diffHours > 0) ? `${diffHours - diffDay * 24}H` : ``;
  const diffMinutesString = (diffMinutes > 0) ? `${diffMinutes - diffHours * 60}M` : ``;
  return `${diffDayString} ${diffHoursString} ${diffMinutesString}`;
};
