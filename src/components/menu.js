import AbstractComponent from "./abstract-component.js";

// export const MenuItem = { /// !!!!12
//   NEW_EVENT: `control__new-event`,
//   STATS: `control__stats`,
//   TABLE: `control__point`,
// }

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

  // setActiveItem(menuItem) {///////12
  //   const item = this.getElement().querySelector(`#${menuItem}`);

  //   if (item) {
  //     item.checked = true;
  //   }
  // }

  // setOnChange(handler) { /////12
  //   this.getElement().addEventListener(`change`, (evt) => {
  //     if (evt.target.tagName !== `INPUT`) {
  //       return;
  //     }

  //     const menuItem = evt.target.id;
  //     handler(menuItem);
  //   })
  // }
}
