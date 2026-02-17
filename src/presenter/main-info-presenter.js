import TripMainInfoView from '../view/trip-main-info.js';
import {remove, render, RenderPosition} from '../framework/render.js';

export default class MainInfoPresenter {
  #model;
  #mainInfoComponent;
  #mainInfoContainer;

  constructor({model, mainInfoContainer}) {
    this.#model = model;
    this.#mainInfoContainer = mainInfoContainer;
  }

  init() {
    if (!this.#mainInfoComponent) {
      this.#mainInfoComponent = new TripMainInfoView({
        mainInfo: this.#model.mainInfo
      });
      render(this.#mainInfoComponent, this.#mainInfoContainer, RenderPosition.AFTERBEGIN);
    }
    this.#model.setMainInfoChangeObserver(this.#handleDataChange);
  }

  #rerenderMainInfo() {
    if (this.#mainInfoComponent) {
      remove(this.#mainInfoComponent);
    }

    this.#mainInfoComponent = new TripMainInfoView({
      mainInfo: this.#model.mainInfo
    });
    render(this.#mainInfoComponent, this.#mainInfoContainer, RenderPosition.AFTERBEGIN);
  }

  #handleDataChange = () => {
    try {
      this.#rerenderMainInfo();

    } catch (error) {
      throw new Error('Can\'t rerender main info');
    }
  };
}
