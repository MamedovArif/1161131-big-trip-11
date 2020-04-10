export const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const formatTimeDate = (date) => {
  const day = castTimeFormat(date.getDate());
  const month = castTimeFormat(date.getMonth() + 1);
  const year = String(date.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
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
  minutes = castTimeFormat(minutes);
  result += `${minutes}M`;
  return result;
};
