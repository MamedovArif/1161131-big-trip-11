import PointOfRouteComponent from '../components/route-point.js';
import FormForEditComponent from '../components/editing-form.js';
import {render, RenderPosition, replace} from '../utils/render.js';

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._pointOfRouteComponent = null;
    this._formForEditComponent = null;
    this._onDataChange = onDataChange;

    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }
  render(dataOfRoute) {
    const oldPointComponent = this._pointOfRouteComponent;
    const oldPointEditComponent = this._formForEditComponent; /// !!!!

    this._pointOfRouteComponent = new PointOfRouteComponent(dataOfRoute);
    this._formForEditComponent = new FormForEditComponent(dataOfRoute);

    this._pointOfRouteComponent.setClickHandler(() => {
      this._replacePointToForm();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._formForEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceFormToPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    });

    this._formForEditComponent.setFavoriteChangeHandler(() => {
      //this.setAttribute(`checked`, true);
      this._onDataChange(this, dataOfRoute, Object.assign({}, dataOfRoute, {
        isFavorite: !dataOfRoute.isFavorite,
      }))
    });

    if (oldTaskEditComponent && oldTaskComponent) { /// !!!
      replace(this._taskComponent, oldTaskComponent);
      replace(this._taskEditComponent, oldTaskEditComponent);
    } else {
      render(this._container, this._pointOfRouteComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== MODE.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  _replacePointToForm() {
    this._onViewChange();
    replace(this._formForEditComponent, this._pointOfRouteComponent);
  };

  _replaceFormToPoint() {
    //document.removeEventListener(`keydown`, this._onEscKeyDown);
    replace(this._pointOfRouteComponent, this._formForEditComponent);
  };

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceFormToPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  };
}
