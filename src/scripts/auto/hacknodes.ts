// Upgraded/Modified version (to Netscript v2 with typescript) of https://github.com/moriakaice/bitburner/blob/master/rent.js
import { BitBurner } from 'bitburner';

export async function main(ns: BitBurner) {
  const allowancePct = 0.05; // 5%
  while (true) {
    let cur$ = ns.getServerMoneyAvailable('home') * allowancePct;
    if (ns.hacknet.getPurchaseNodeCost() < cur$) {
      ns.hacknet.purchaseNode();
    } else {
      for (let i = 0, len = ns.hacknet.numNodes(); i < len; i++) {
        if (ns.hacknet.getLevelUpgradeCost(i, 1) < cur$) {
          ns.hacknet.upgradeLevel(i, 1);
          break;
        } else if (ns.hacknet.getRamUpgradeCost(i, 1) < cur$) {
          ns.hacknet.upgradeRam(i, 1);
          break;
        } else if (ns.hacknet.getCoreUpgradeCost(i, 1) < cur$) {
          ns.hacknet.upgradeCore(i, 1);
          break;
        }
      }
    }
    await ns.sleep(500);
  }
}
