import { programs } from 'lib-util-constants.js';
import { BitBurner } from 'bitburner';

export const currentOpenPortSoftware = (ns: BitBurner): number => {
  return programs.filter(it => ns.fileExists(it, 'home')).length;
};
