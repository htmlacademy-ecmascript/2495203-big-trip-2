import {
  capitalizeFirstLetter,
  getIconSrcByEventType
} from './utils.js';
import {UNSET_PRICE_VALUE} from './constants.js';

export function typeChangeHandler({evt, component}) {

  const chosenTypeId = evt.target.value;
  const chosenTypeName = component.pointTypes[chosenTypeId].name;

  component.updateElement({
    type: component.pointTypes[chosenTypeId]
  });
  component.typesOutput.textContent = capitalizeFirstLetter(chosenTypeName);
  component.typeIcon.src = getIconSrcByEventType(chosenTypeName);
  component.typeToggler.checked = false;
}

export function destinationInputHandler({evt, component}) {
  const input = evt.target;
  const value = input.value;
  const allowedCities = component.cities.map(({cityName}) => cityName);

  if (!allowedCities.includes(value)) {
    input.setCustomValidity(`Allowed cities: ${allowedCities.join(', ')}`);
    return;
  }

  input.setCustomValidity('');
  component.updateElement({
    destination: component.cities.find(({cityName}) => cityName === value)
  });
}

export function priceInputHandler({evt, component}) {
  const newPrice = evt.target.value;

  component.state = {
    price: newPrice ? parseInt(newPrice, 10) : UNSET_PRICE_VALUE
  };
}

export function offerClickHandler({evt, component}) {
  const clickedOffer = evt.target;
  const clickedOfferId = clickedOffer.value;
  const typeCopy = structuredClone(component.state.type);
  const targetOption = typeCopy.options.find(({id}) => id === clickedOfferId);

  targetOption.checked = clickedOffer.checked;
  component.state = {
    type: typeCopy
  };
}
