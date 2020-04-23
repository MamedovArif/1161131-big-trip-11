import PointOfRouteComponent from '../components/route-point.js';
import FormForEditComponent from '../components/editing-form.js';
import {render, RenderPosition, replace} from '../utils/render.js';


export default class PointController {
  constructor(container) {
    this._container = container;
    this._pointOfRouteComponent = null;
    this._formForEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }
  render(dataOfRoute) {
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

    render(this._container, this._pointOfRouteComponent, RenderPosition.BEFOREEND);
  }

  _replacePointToForm() {
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
