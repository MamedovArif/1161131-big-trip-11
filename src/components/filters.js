import AbstractComponent from "./abstract-component.js";

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
}

const createFiltersTemplate = () => {
  return (
    `<form class="trip-filters" action="#" method="get">
      <div class="trip-filters__filter">
        <input id="filter-everything" class="trip-filters__filter-input
        visually-hidden" type="radio" name="trip-filter" value="everything" checked>
        <label class="trip-filters__filter-label" data-filter-type="${FilterType.EVERYTHING}"
        for="filter-everything">Everything</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-future" class="trip-filters__filter-input
        visually-hidden" type="radio" name="trip-filter" value="future" >
        <label class="trip-filters__filter-label" data-filter-type="${FilterType.FUTURE}"
        for="filter-future">Future</label>
      </div>

      <div class="trip-filters__filter">
        <input id="filter-past" class="trip-filters__filter-input
        visually-hidden" type="radio" name="trip-filter" value="past" >
        <label class="trip-filters__filter-label" data-filter-type="${FilterType.PAST}"
        for="filter-past">Past</label>
      </div>

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
      const iden = evt.target.getAttribute(`for`);
      const input = document.querySelector(`#${iden}`);
      input.setAttribute(`checked`, true);

      this._currenFilterType = filterType;

      handler(this._currenFilterType);
    })
  }
}
