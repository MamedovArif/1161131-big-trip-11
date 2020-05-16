import PointOfRouteComponent from '../components/route-point.js';
import FormForEditComponent from '../components/editing-form.js';
import PointModel from '../models/point.js';
import {render, RenderPosition, remove, replace} from '../utils/render.js';
import * as _ from 'lodash';
// import {cloneDeep} from 'lodash';

const SHAKE_ANIMATION_TIMEOUT = 600;

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyPoint = {
  "basePrice": 222,
  "dateFrom": new Date(),
  "dateTo": new Date(),
  "destination": null,
  "id": String(new Date() + Math.random()),
  "isFavorite": false,
  "type": `taxi`,
  "offers": []
};

const parseFormData = (formData, form, id, dataAboutDestinations, dataAboutOffers) => {
  const definitionFavorite = (bool) => {
    if (bool) {
      return true;
    }
    return false;
  };
  const transferText = form.querySelector(`.event__label`).textContent.trim().split(` `);
  const type = transferText[0].toLowerCase();
  let destination = dataAboutDestinations.find((item) => {
    return item.name === formData.get(`event-destination`);
  });
  if (!destination) {
    destination = dataAboutDestinations[0];
  }
  const formObject = {
    "id": id,
    "base_price": Math.abs(parseInt(formData.get(`event-price`), 10)),
    "date_from": formData.get(`event-start-time`),
    "date_to": formData.get(`event-end-time`),
    "destination": destination,
    "is_favorite": definitionFavorite(formData.get(`event-favorite`)),
    "type": type,
  };

  const containerOfCheckbox = form.querySelector(`.event__available-offers`);
  if (containerOfCheckbox) {
    const offers = Array.from(containerOfCheckbox.querySelectorAll(`.event__offer-checkbox`)); // empty offers
    const markerOffers = offers.filter((input) => {
      return input.getAttribute(`value`) === `true`;
    });
    const arrayOfIdies = markerOffers.map((input) => {
      return input.getAttribute(`id`);
    });
    const titles = arrayOfIdies.map((iden) => {
      let arr = iden.split(`-`);
      arr.splice(0, 2);
      arr.pop();
      const title = arr.join(` `);
      return title;
    });
    const ourOffers = dataAboutOffers.find((it) => {
      return it.type === type;
    });
    formObject.offers = ourOffers.offers.filter((obj) => {
      return titles.includes(obj.title);
    });
  } else {
    formObject.offers = [];
  }

  return new PointModel(formObject);
};


export default class PointController {
  constructor(container, onDataChange, onViewChange, dataAboutDestinations, dataAboutOffers) {
    this._container = container;
    this._pointOfRouteComponent = null;
    this._formForEditComponent = null;
    this._onDataChange = onDataChange;
    this._dataAboutDestinations = dataAboutDestinations;
    this._dataAboutOffers = dataAboutOffers;

    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }
  render(dataOfRoute, mode) {
    const oldPointComponent = this._pointOfRouteComponent;
    const oldPointEditComponent = this._formForEditComponent;
    this._mode = mode;

    this._pointOfRouteComponent = new PointOfRouteComponent(dataOfRoute,
        this._dataAboutDestinations, this._dataAboutOffers);
    this._formForEditComponent = new FormForEditComponent(dataOfRoute,
        this._dataAboutDestinations, this._dataAboutOffers);

    this._pointOfRouteComponent.setClickHandler(() => {
      this._replacePointToForm();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._formForEditComponent.setCloseHandler(() => { // сброс значений
      this._replaceFormToPoint();
    });

    this._formForEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();

      const obj = this._formForEditComponent.getData();

      const forma = obj.form;
      const start = forma.querySelector(`input[name = event-start-time]`);
      const end = forma.querySelector(`input[name = event-end-time]`);

      let startTime = new Date(start.getAttribute(`value`));
      let endTime = new Date(end.getAttribute(`value`));

      if (startTime > endTime) {
        forma.querySelector(`input[type = datetime-local]`)
            .setCustomValidity('Дата начала должна наступать раньше даты окончания');
        forma.querySelector(`input[type = datetime-local]`).style = 'border: 2px solid tomato;';

        startTime = new Date(start.getAttribute(`value`));
        endTime = new Date(end.getAttribute(`value`));
      } else {
        forma.querySelector(`select[name = event-destination]`).setCustomValidity('');
        forma.querySelector(`select[name = event-destination]`).style = 'border: none;';

        const data = parseFormData(obj.formData, obj.form, dataOfRoute.id,
            this._dataAboutDestinations, this._dataAboutOffers);
        this._formForEditComponent.setData({
          saveButtonText: `Saving...`,
        });
        this._onDataChange(this, dataOfRoute, data);
        //this._replaceFormToPoint();
      }
    });

    this._formForEditComponent.setDeleteButtonClickHandler(() => {
      this._formForEditComponent.setData({
        deleteButtonText: `Deleting...`,
      });
      this._onDataChange(this, dataOfRoute, null);
    });

    this._formForEditComponent.setFavoriteChangeHandler(() => {
      const newPoint = PointModel.clone(dataOfRoute);
      newPoint.isFavorite = !newPoint.isFavorite;
      this._onDataChange(this, dataOfRoute, newPoint);
    });

    this._formForEditComponent.setOfferChangeHandler((evt) => {
      const id = evt.target.id;
      const arr = id.split(`-`);
      arr.splice(0, 2);
      arr.pop();
      const title = arr.join(` `);
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
        const offer = object.offers.find((offerOne) => {
          return offerOne.title === title;
        });
        deepClone.offers.push(offer);
      }
      this._onDataChange(this, dataOfRoute, deepClone);
    });

    this._formForEditComponent.setBasePriceChangeHandler((evt) => {
      const newPoint = PointModel.clone(dataOfRoute);
      newPoint.basePrice = Math.abs(parseInt(evt.target.value, 10))
      this._onDataChange(this, dataOfRoute, newPoint);
    });

    this._formForEditComponent.setDateFromChangeHandler((evt) => {
      const newPoint = PointModel.clone(dataOfRoute);
      newPoint.dateFrom = new Date(evt.target.value)
      this._onDataChange(this, dataOfRoute, newPoint);
    });

    this._formForEditComponent.setDateToChangeHandler((evt) => {
      const newPoint = PointModel.clone(dataOfRoute);
      newPoint.dateTo = new Date(evt.target.value)
      this._onDataChange(this, dataOfRoute, newPoint);
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

  shake() {
    this._formForEditComponent.getElement().style.animation =
        `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._pointOfRouteComponent.getElement().style.animation =
        `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._formForEditComponent.getElement().style.animation = ``;
      this._pointOfRouteComponent.getElement().style.animation = ``;
      this._formForEditComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
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
        this._onDataChange(this, EmptyPoint, null);
      }
      this._replaceFormToPoint();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
