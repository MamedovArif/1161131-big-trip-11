import {SortType} from "../const.js";
import SortComponent from "../components/sort.js";
import {render, replace, RenderPosition} from "../utils/render.js";

export default class SortController {
  constructor(container, pointsModel, filterComponent) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._activeSortType = SortType.EVENT;
    this._sortComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortChange = this._onSortChange.bind(this);

    this._pointsModel.setDataChangeHandler(this._onDataChange);

    this._filterComponent = filterComponent; // per
  }

  render() {
    const container = this._container;
    const sorts = Object.values(SortType).map((sortType) => {
      return {
        name: sortType,
        isChecked: sortType === this._activeSortType,
      };
    });

    const oldComponent = this._sortComponent;

    this._sortComponent = new SortComponent(sorts);
    this._sortComponent.setSortChangeHandler(this._onSortChange, this._filterComponent);

    if (oldComponent) {
      replace(this._sortComponent, oldComponent);
    } else {
      render(container, this._sortComponent, RenderPosition.BEFOREEND);
    }
  }

  _onSortChange(sortType) {
    this._pointsModel.setSort(sortType);
    this._activeSortType = sortType;
  }

  _onDataChange() {
    this.render();
  }

  throwDateOnTimeAndPrice() {
    console.log(this._activeSortType);
    if (this._activeSortType !== SortType.EVENT) {
      const parentList = this._container.querySelector(`.trip-days`);
      parentList.querySelector(`.day__counter`).textContent = ``;
      parentList.querySelector(`.day__date`).textContent = ``;
    }
  }
}
