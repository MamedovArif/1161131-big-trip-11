import AbstractComponent from "./abstract-component.js";

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};
const generateOneFilter = (type, bool) => {
  return (
    `<div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input
      visually-hidden" type="radio" name="trip-filter" value="${type}"
      ${(bool) ? `checked` : ``}>
      <label class="trip-filters__filter-label" data-filter-type="${type}"
      for="filter-${type}">${type.toUpperCase()}</label>
    </div>`
  )
}

const createFiltersTemplate = () => {
  const filters = Object.values(FilterType);
  const booleans = [true, false, false];
  const filtersMarkup = [];
  for (let i = 0; i < filters.length; i++) {
    filtersMarkup.push(generateOneFilter(filters[i], booleans[i]));
  }
  return (
    `<form class="trip-filters" action="#" method="get">
      ${filtersMarkup.join(`\n`)}
      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`
  );
};

export default class Filter extends AbstractComponent {
  constructor() {
    super();
    this._currenFilterType = FilterType.EVERYTHING;
  }

  getTemplate() {
    return createFiltersTemplate();
  }

  getFilterType() {
    return this._currenFilterType;
  }

  setFilterTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `LABEL`) {
        return;
      }

      const filterType = evt.target.dataset.filterType;

      if (this._currenFilterType === filterType) {
        return;
      }
      document.querySelector(`#filter-${this._currenFilterType}`).removeAttribute(`checked`);
      const id = evt.target.getAttribute(`for`);
      const input = document.querySelector(`#${id}`);
      input.setAttribute(`checked`, true);

      this._currenFilterType = filterType;

      handler(this._currenFilterType);
    });
  }
}
