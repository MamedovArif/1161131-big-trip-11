import PointOfRouteComponent from '../components/route-point.js';
import FormForEditComponent from '../components/editing-form.js';
import PointModel from '../models/point.js';
import {render, RenderPosition, remove, replace} from '../utils/render.js';
import {upperFirstElement} from '../utils/common.js';
import {option} from "../mock/route-point.js";
import {cloneDeep} from 'lodash';

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyPoint = {
  "basePrice": 222,
  "dateFrom": new Date(),
  "dateTo": new Date(),
  "destination": {
      "description": "London exerts a considerable impact upon the arts, " +
          "commerce, education, entertainment, fashion, finance, healthcare, " +
          "media, professional services, research and development, tourism and " +
          "transportation.London ranks 26th out of 300 major cities for economic performance.",
      "name": `London`,
      "pictures": [
          {
            "src": `http://picsum.photos/248/152?r=${Math.random()}`,
            "description": "London parliament building"
          },
        ]
      },
  "id": String(new Date() + Math.random()),
  "isFavorite": false,
  "type": "taxi",
  "offers": [
      {
        "title": "Choose meal",
        "price": 180
      }, {
        "title": "Upgrade to comfort class",
        "price": 50
      },
  ]
}

export default class PointController {
  constructor(container, onDataChange, onViewChange, dataAboutDestinations, dataAboutOffers) {
    this._container = container;
    this._pointOfRouteComponent = null;
    this._formForEditComponent = null;
    this._onDataChange = onDataChange;
    this._dataAboutDestinations = dataAboutDestinations; ////!!!!
    this._dataAboutOffers = dataAboutOffers;

    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }
  render(dataOfRoute, mode) {
    const oldPointComponent = this._pointOfRouteComponent;
    const oldPointEditComponent = this._formForEditComponent;
    this._mode = mode;

    this._pointOfRouteComponent = new PointOfRouteComponent(dataOfRoute);
    this._formForEditComponent = new FormForEditComponent(dataOfRoute,
        this._dataAboutDestinations, this._dataAboutOffers);

    this._pointOfRouteComponent.setClickHandler(() => {
      this._replacePointToForm();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._formForEditComponent.setCloseHandler(() => { //сброс значений
      this._replaceFormToPoint();
    });

    this._formForEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._formForEditComponent.getData(dataOfRoute.id);
      this._onDataChange(this, dataOfRoute, data);
      this._replaceFormToPoint();
    });
    this._formForEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this,
        dataOfRoute, null));

    this._formForEditComponent.setFavoriteChangeHandler(() => {
      this._onDataChange(this, dataOfRoute, Object.assign({}, dataOfRoute, {
        isFavorite: !dataOfRoute.isFavorite,
      }));
    });

    this._formForEditComponent.setOfferChangeHandler((evt) => {  ///!!!
      const id = evt.target.id;
      console.log(id);
      const arr = id.split(`-`); //Choose comfort class
      console.log(arr);
      arr.splice(0, 2);
      console.log(arr);
      arr.pop();
      console.log(arr);
      const title = arr.join(` `);
      console.log(title);
      const object = this._dataAboutOffers.find((item) => {
        return item.type === dataOfRoute.type;
      });
      const deepClone = _.cloneDeep(dataOfRoute);
      const isSuccess = dataOfRoute.offers.find((obj) => {
        return obj.title === title;
      });
      if (isSuccess) {
        deepClone.offers = deepClone.offers.filter((offer) => {
          return offer.title !== title;
        });
      } else {
        const offer = object.offers.find((offer) => {
          return offer.title === title;
        })
        deepClone.offers.push(offer);
      }
      this._onDataChange(this, dataOfRoute, deepClone);
    });

    this._formForEditComponent.setBasePriceChangeHandler((evt) => {
      this._onDataChange(this, dataOfRoute, Object.assign({}, dataOfRoute, {
        basePrice: Math.abs(parseInt(evt.target.value)),
      }));
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldPointComponent && oldPointEditComponent) {
          replace(this._pointOfRouteComponent, oldPointComponent);
          replace(this._formForEditComponent, oldPointEditComponent);
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
