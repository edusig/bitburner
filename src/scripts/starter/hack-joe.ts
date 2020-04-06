import { BitBurner as NS } from 'bitburner';
import { autonuke } from 'lib-util-auto-nuke.js';
import { currentOpenPortSoftware } from 'lib-util-current-open-port-software.js';

export async function main(ns: NS) {
  let target = 'joesguns';
  const moneyThreshold = ns.getServerMaxMoney(target) * 0.75;
  const securityThreshold = ns.getServerMinSecurityLevel(target) + 5;
  await autonuke(
    ns,
    target,
    currentOpenPortSoftware(ns),
    ns.getHackingLevel(),
    ns.getServerRequiredHackingLevel(target),
    ns.getServerNumPortsRequired(target)
  );
  while (true) {
    if (ns.getServerSecurityLevel(target) > securityThreshold) {
      await ns.weaken(target);
    } else if (ns.getServerMoneyAvailable(target) < moneyThreshold) {
      await ns.grow(target);
    } else {
      await ns.hack(target);
    }
    await ns.sleep(500);
  }
}
