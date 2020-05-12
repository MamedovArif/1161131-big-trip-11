export default class Point {
  constructor(data) { //забираю с сервера
    this.id = data[`id`];
    this.destination = data[`destination`] || {};
    this.basePrice = data[`base_price`];
    this.dateFrom = new Date(data[`date_from`])
    this.dateTo = new Date(data[`date_to`]);
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.type = data[`type`];
    this.offers = data[`offers`] || [];
  }

  toRAW() { //отдаю серверу
    return {
      'id': this.id,
      'destination': this.destination,
      'base_price': this.basePrice,
      'date_from': this.dateFrom,
      'date_to': this.dateTo,
      'is_favorite': this.isFavorite,
      'type': this.type,
      'offers': this.offers,
    }
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    console.log(data);
    return new Point(data.toRAW());
  }
}
