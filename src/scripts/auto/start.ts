// Upgraded/Modified version (to Netscript v2 with typescript) of https://github.com/moriakaice/bitburner/blob/master/start.js
import { BitBurner } from 'bitburner';
import { ServerInfo } from 'lib-util-server-info.js';

export async function main(ns: BitBurner) {
  const hn = ns.getHostname();
  const srvList: { [key: string]: ServerInfo } = JSON.parse(
    ns.read('spider-servers.txt') as string
  );
  let looping = true;
  let lastT: ServerInfo;
  let minSecWei = 100;
  while (looping) {
    for (let k in srvList) {
      let shouldSwitchTargets = false;
      let srv = srvList[k];
      if (ns.hasRootAccess(srv.host)) {
        ns.print(
          `Vulnerable server ${srv.host} found with difficulty of ${srv.hackReq} and ports: ${srv.portReq}`
        );
        if (lastT == null) {
          shouldSwitchTargets = true;
        } else {
          let wValLastT = lastT.maxMoney * (minSecWei / lastT.minSec);
          let wValCurrT = srv.maxMoney * (minSecWei / srv.minSec);
          shouldSwitchTargets = wValLastT < wValCurrT;
        }

        if (shouldSwitchTargets) {
          if (lastT != null) {
            ns.scriptKill('scripts-auto-daemon.js', hn);
            ns.print(
              `Targeting daemon has found a more suitable target than ${lastT.host} - Switching to ${srv.host}`
            );
          }
          let hasRunDaemon = false;
          while (!hasRunDaemon) {
            ns.run('scripts-auto-daemon.js', 1, JSON.stringify(srv));
            hasRunDaemon = ns.isRunning('scripts-auto-daemon.js', hn, JSON.stringify(srv));
            console.log('HAS RUN DAEMON', hn);
            await ns.sleep(500);
          }
          lastT = srv;
        }
        delete srvList[k];
      }
    }
    looping = Object.keys(srvList).length > 0;
    await ns.sleep(500);
  }
}
