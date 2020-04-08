const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

export const diffTime = (begin, end) => {
  let minutes = (end - begin)/(1000 * 60);
  let days;
  let hours;
  let result = ``;
  if (minutes >= 24 * 60) {
    days = Math.floor(minutes / (60 * 24));
    minutes = minutes % (60 * 24);
    result += `${days}D `;
  }
  if (minutes >= 60) {
    hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    result += `${hours}H `
  }
  result += `${minutes}M`
  return result;
}
