import {FilterType} from "../const.js";
import FilterComponent from "../components/filters.js";
import {render, replace, RenderPosition} from "../utils/render.js";
import {getFilteredPoints} from "../utils/filter.js";

export default class FilterController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._activeFilterType = FilterType.EVERYTHING;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointsModel.setDataChangeHandler(this._onDataChange);
  }

  render(fullDataPoints) {
    const filteredPointsForFuture = getFilteredPoints(fullDataPoints, FilterType.FUTURE);
    const filteredPointsForPast = getFilteredPoints(fullDataPoints, FilterType.PAST);

    const container = this._container;
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        isChecked: filterType === this._activeFilterType,
        disabled: (filterType === FilterType.FUTURE && filteredPointsForFuture.length === 0) ||
            (filterType === FilterType.PAST && filteredPointsForPast.length === 0),
      };
    });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  _onFilterChange(filterType) {
    this._pointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render(this._pointsModel.getPointsAll());
  }

  throwFilter() {
    if (this._activeFilterType !== FilterType.EVERYTHING) {
      this._activeFilterType = FilterType.EVERYTHING;
      this._onDataChange();
    }
  }
}
