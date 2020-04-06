import { BitBurner as NS } from 'bitburner';

export async function main(ns: NS) {
  const target = ns.args.length > 0 ? ns.args[0] : 'foodnstuff';
  const moneyThreshold = ns.getServerMaxMoney(target) * 0.75;
  const securityThreshold = ns.getServerMinSecurityLevel(target) + 5;
  if (ns.fileExists('BruteSSH.exe', 'home')) {
    ns.brutessh(target);
  }

  ns.nuke(target);

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
