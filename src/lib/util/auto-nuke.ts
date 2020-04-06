import { Host, BitBurner } from 'bitburner';
import { programs } from 'lib-util-constants.js';

export async function autonuke(
  ns: BitBurner,
  host: Host,
  curOpenPortSoft: number,
  hackLvl: number,
  reqHackLvl: number,
  reqOpenPortSoft: number
): Promise<boolean> {
  if (hackLvl < reqHackLvl || curOpenPortSoft < reqOpenPortSoft) {
    return false;
  }
  if (!ns.hasRootAccess(host)) {
    const progs = programs.slice(0, curOpenPortSoft);
    while (progs.length > 0) {
      let prog = progs.shift();
      if (prog === 'BruteSSH.exe') {
        ns.brutessh(host);
      }
      if (prog === 'FTPCrack.exe') {
        ns.ftpcrack(host);
      }
      if (prog === 'relaySMTP.exe') {
        ns.relaysmtp(host);
      }
      if (prog === 'HTTPWorm.exe') {
        ns.httpworm(host);
      }
      if (prog === 'SQLInject.exe') {
        ns.sqlinject(host);
      }
      await ns.sleep(500);
    }
    ns.nuke(host);
  }
  return true;
}
