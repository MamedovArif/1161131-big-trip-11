import PointOfRouteComponent from '../components/route-point.js';
import FormForEditComponent from '../components/editing-form.js';
import PointModel from '../models/point.js';
import {render, RenderPosition, remove, replace} from '../utils/render.js';

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
  const dataFromEditForm = {
    "base_price": Math.abs(parseInt(formData.get(`event-price`), 10)),
    "date_from": formData.get(`event-start-time`),
    "date_to": formData.get(`event-end-time`),
    "destination": destination,
    "is_favorite": definitionFavorite(formData.get(`event-favorite`)),
    "type": type,
  };

  if (id) {
    dataFromEditForm.id = id;
  }

  const containerOfCheckbox = form.querySelector(`.event__available-offers`);
  if (containerOfCheckbox) {
    const offers = Array.from(containerOfCheckbox.querySelectorAll(`.event__offer-checkbox`));
    const markerOffers = offers.filter((input) => {
      return input.getAttribute(`value`) === `true`;
    });
    const ids = markerOffers.map((input) => {
      return input.getAttribute(`id`);
    });
    const titles = ids.map((iden) => {
      const label = form.querySelector(`label[for = ${iden}]`);
      const title = label.querySelector(`span`).textContent;
      return title;
    });
    const allPossibleOurOffers = dataAboutOffers.find((it) => {
      return it.type === type;
    });
    dataFromEditForm.offers = allPossibleOurOffers.offers.filter((offer) => {
      return titles.includes(offer.title);
    });
  } else {
    dataFromEditForm.offers = [];
  }

  return new PointModel(dataFromEditForm);
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

    this._pointOfRouteComponent = new PointOfRouteComponent(dataOfRoute);
    this._formForEditComponent = new FormForEditComponent(dataOfRoute,
        this._dataAboutDestinations, this._dataAboutOffers);

    this._pointOfRouteComponent.setClickHandler(() => {
      this._replacePointToForm();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._formForEditComponent.setCloseHandler(() => {
      this._replaceFormToPoint();
    });

    this._formForEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const dataFromParseForm = this._formForEditComponent.getData();

      const data = parseFormData(dataFromParseForm.formData, dataFromParseForm.form, dataOfRoute.id || null,
          this._dataAboutDestinations, this._dataAboutOffers);
      this._formForEditComponent.setData({
        saveButtonText: `Saving...`,
      });
      this._onDataChange(this, dataOfRoute, data);
    });

    this._formForEditComponent.setDeleteButtonClickHandler(() => {
      this._formForEditComponent.setData({
        deleteButtonText: `Deleting...`,
      });
      this._onDataChange(this, dataOfRoute, null);
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
        if (oldPointComponent && oldPointEditComponent) {
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
    this._formForEditComponent.reset();
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
