// Upgraded/Modified version (to Netscript v2 with typescript) of https://github.com/moriakaice/bitburner/blob/master/grow-target.js
import { BitBurner } from 'bitburner';

export async function main(ns: BitBurner) {
  await ns.grow(ns.args[0]);
}
