import PointOfRouteComponent from '../components/route-point.js';
import FormForEditComponent from '../components/editing-form.js';
import {render, RenderPosition, remove, replace} from '../utils/render.js';
import {option} from "../mock/route-point.js";

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

// export const EmptyPoint = {
//   id: String(new Date() + Math.random()),
//   type: `Taxi`,
//   isFavorite: false,
//   city: ``,
//   price: 0,
//   placeholder: ``,
//   timeBegin: new Date(),
//   timeEnd: new Date(),
//   destination: [],
//   photos: [],
//   options: option[`Taxi`.toLowerCase()],
// };

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
  render(dataOfRoute, mode) {
    const oldPointComponent = this._pointOfRouteComponent;
    const oldPointEditComponent = this._formForEditComponent;
    this._mode = mode;

    this._pointOfRouteComponent = new PointOfRouteComponent(dataOfRoute);
    this._formForEditComponent = new FormForEditComponent(dataOfRoute);

    this._pointOfRouteComponent.setClickHandler(() => {
      this._replacePointToForm();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._formForEditComponent.setCloseHandler(() => {
      this._replaceFormToPoint();
    });

    this._formForEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._formForEditComponent.getData();
      this._onDataChange(this, dataOfRoute, data);
    });
    this._formForEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this,
        dataOfRoute, null));

    this._formForEditComponent.setFavoriteChangeHandler(() => {
      this._onDataChange(this, dataOfRoute, Object.assign({}, dataOfRoute, {
        isFavorite: !dataOfRoute.isFavorite,
      }));
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldPointComponent && oldPointEditComponent) {
          replace(this._pointOfRouteComponent, oldPointComponent);
          replace(this._formForEditComponent, oldPointEditComponent);
          this._replaceFormToPoint();
        } else {
          render(this._container, this._pointOfRouteComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldPointComponent && oldPointEditComponent) { // в каком случае они возвращают правду
          remove(oldPointComponent);
          remove(oldPointEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._formForEditComponent, RenderPosition.BEFOREEND);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  destroy() {
    remove(this._pointOfRouteComponent);
    remove(this._formForEditComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _replacePointToForm() {
    this._onViewChange();
    replace(this._formForEditComponent, this._pointOfRouteComponent);
    this._mode = Mode.EDIT;
  }

  _replaceFormToPoint() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    // this._formForEditComponent.reset(); // перед закрытием откатываем изменения
    // replace(this._pointOfRouteComponent, this._formForEditComponent);

    if (document.contains(this._formForEditComponent.getElement())) {
      replace(this._pointOfRouteComponent, this._formForEditComponent);
    }
    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyPoint, null); // 12
      }
      this._replaceFormToPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
