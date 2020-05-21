import AbstractComponent from "./abstract-component.js";

const generateOneFilter = (dataForPoint) => {
  const {name, isChecked} = dataForPoint;
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${name}" class="trip-filters__filter-input
      visually-hidden" type="radio" name="trip-filter" value="${name}"
      ${(isChecked) ? `checked` : ``}>
      <label class="trip-filters__filter-label" data-filter-type="${name}"
      for="filter-${name}">${name.toUpperCase()}</label>
    </div>`
  );
};

const createFiltersTemplate = (filters) => {
  const filtersMarkup = filters.map((item) => generateOneFilter(item)).join(`\n`);
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersMarkup}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

const FILTER_ID_PREFIX = `filter-`;

const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (evt) => {
      const filterName = getFilterNameById(evt.target.id);
      handler(filterName);
    });
  }
}
