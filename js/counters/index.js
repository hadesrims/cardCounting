import { hiLoSystem } from './hi-lo.js';
import { hiOptIiSystem } from './hi-opt-ii.js';
import { zenCountSystem } from './zen-count.js';
import { omegaIiSystem } from './omega-ii.js';

export const countingSystems = [
  hiLoSystem,
  hiOptIiSystem,
  zenCountSystem,
  omegaIiSystem,
];

export function getSystemById(systemId) {
  return countingSystems.find((system) => system.id === systemId) || hiLoSystem;
}
