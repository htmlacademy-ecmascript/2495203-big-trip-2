import {render} from '../render.js';
import TripPointAddingFormView from '../view/trip-point-adding-form-view.js';
import TripPointView from '../view/trip-point-view.js';

export default class TripPointsListPresenter {
  constructor({listElement, pointsModel}) {
    this.listElement = listElement;
    this.pointsModel = pointsModel;
    this.pointsData = this.pointsModel.getTripPoints();
    this.addingFormComponent = new TripPointAddingFormView(this.pointsModel);
  }

  init() {
    render(this.addingFormComponent, this.listElement);
    this.pointsData.forEach((modelItem) => {
      render(new TripPointView(modelItem), this.listElement);
    });
  }
}
