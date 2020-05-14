import AbstractComponent from "./abstract-component.js";

export const MenuItem = {
  STATS: `Stats`,
  TABLE: `Table`,
}

const createMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>
    </nav>`
  );
};

export default class Menu extends AbstractComponent {
  getTemplate() {
    return createMenuTemplate();
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }
      if (evt.target.className === `trip-tabs__btn  trip-tabs__btn--active`) {
        return;
      }
      const links = this.getElement().querySelectorAll(`.trip-tabs__btn`);
      for (let i = 0; i < links.length; i++) {
        links[i].classList.remove(`trip-tabs__btn--active`)
      }
      evt.target.classList.add(`trip-tabs__btn--active`);
      const menuItem = evt.target.textContent;
      handler(menuItem);
    })
  }
}
