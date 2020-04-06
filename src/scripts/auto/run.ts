// Upgraded/Modified version (to Netscript v2 with typescript) of https://github.com/moriakaice/bitburner/blob/master/botnet.js
import { BitBurner } from 'bitburner';

export async function main(ns: BitBurner) {
  if (!ns.scriptRunning('scripts-auto-hacknodes.js', 'home')) {
    ns.exec('scripts-auto-hacknodes.js', 'home');
  }
  if (!ns.scriptRunning('scripts-auto-buy-srv.js', 'home')) {
    ns.exec('scripts-auto-buy-srv.js', 'home');
  }
  if (!ns.scriptRunning('scripts-auto-spider.js', 'home')) {
    ns.exec('scripts-auto-spider.js', 'home');
  }
}
