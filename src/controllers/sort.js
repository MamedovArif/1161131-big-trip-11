import {SortType} from "../const.js";
import SortComponent from "../components/sort.js";
import {render, replace, RenderPosition} from "../utils/render.js";
//import {getPointsBySort} from "../utils/sort.js";

export default class SortController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._activeSortType = SortType.EVENT;
    this._sortComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortChange = this._onSortChange.bind(this);

    this._pointsModel.setDataChangeHandler(this._onDataChange);
    // //setSortChangeHandler
  }

  render() {
    const container = this._container;
    const allPoints = this._pointsModel.getPointsAll();
    const sorts = Object.values(SortType).map((sortType) => {
      return {
        name: sortType,
        isChecked: sortType === this._activeSortType,
      };
    });

    const oldComponent = this._sortComponent;

    this._sortComponent = new SortComponent(sorts); // берем содержимое компонента
    this._sortComponent.setSortChangeHandler(this._onSortChange);

    if (oldComponent) {
      replace(this._sortComponent, oldComponent);
    } else {
      render(container, this._sortComponent, RenderPosition.BEFOREEND);
    }
  }

  _onSortChange(sortType) {
    this._pointsModel.setSort(sortType);

    this._activeSortType = sortType;
    ////remove
    //const points = this._pointsModel.getPoints();
    ////console.log(points);
    ////_onDataChange()
  }

  _onDataChange() {
    this.render();
  }
}
