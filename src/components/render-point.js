import FormForEditComponent from './editing-form.js';
import PointOfRouteComponent from './route-point.js';
import {render, RenderPosition} from '../utils.js';

export const renderPoint = (place, dataOfRoute) => {

  const replacePointToForm = () => {
    place.replaceChild(editForm, elementOfPointOfRoute);
  };

  const replaceFormToPoint = () => {
    place.replaceChild(elementOfPointOfRoute, editForm);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceFormToPoint();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const pointOfRouteComponent = new PointOfRouteComponent(dataOfRoute);
  const elementOfPointOfRoute = pointOfRouteComponent.getElement();
  const arrowButton = elementOfPointOfRoute.querySelector(`.event__rollup-btn`);
  arrowButton.addEventListener(`click`, () => {
    replacePointToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const formForEditComponent = new FormForEditComponent(dataOfRoute);
  const editForm = formForEditComponent.getElement();
  editForm.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceFormToPoint();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(place, elementOfPointOfRoute, RenderPosition.BEFOREEND);
};
