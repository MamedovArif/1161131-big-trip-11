export default class Point {
  constructor(data) {
    this.id = data[`id`];
    //this.destination.description = data[`destination`][`description`] || ``;
    //this.destination.name = data[`destination`][`name`] || ``;
    //this.destination.pictures = data[`destination`][`pictures`] || [];
    this.basePrice = data[`base_price`];
    this.dateFrom = data[`date_from`];
    this.dateTo = data[`date_to`];
    this.isFavorite = data[`is_favorite`];
    this.type = data[`type`];
    //this.offers = data[`offers`] || [];
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    console.log(data);
    return data.map(Point.parsePoint);
  }
}
