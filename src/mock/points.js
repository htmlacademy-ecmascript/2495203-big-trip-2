import {pointTypes} from './point-types.js';
import {cities} from './cities.js';
import {getRandomArrayElement} from '../utils.js';
import {nanoid} from 'nanoid';

const mockPoints = [
  {
    id: nanoid(),
    type: getRandomArrayElement(pointTypes),
    destination: getRandomArrayElement(cities),
    startDate: new Date('2025-11-18 10:30'),
    endDate: new Date('2025-11-18 11:30'),
    price: 1100,
    isFavorite: false,
  },
  {
    id: nanoid(),
    type: getRandomArrayElement(pointTypes),
    destination: getRandomArrayElement(cities),
    startDate: new Date('2025-10-19 11:30'),
    endDate: new Date('2025-11-19 12:31'),
    price: 1200,
    isFavorite: true,
  },
  {
    id: nanoid(),
    type: getRandomArrayElement(pointTypes),
    destination: getRandomArrayElement(cities),
    startDate: new Date('2025-11-20 12:30'),
    endDate: new Date('2025-11-20 13:32'),
    price: 1300,
    isFavorite: false,
  },
  {
    id: nanoid(),
    type: getRandomArrayElement(pointTypes),
    destination: getRandomArrayElement(cities),
    startDate: new Date('2025-11-21 13:30'),
    endDate: new Date('2025-11-21 14:33'),
    price: 1400,
    isFavorite: false,
  },
];

export {mockPoints};
