// Upgraded/Modified version (to Netscript v2 with typescript) of https://github.com/moriakaice/bitburner/blob/master/hackAll.js
import { autoScripts } from 'lib-util-constants.js';
import { BitBurner } from 'bitburner';
import { ServerInfo } from 'lib-util-server-info.js';
import { currentOpenPortSoftware } from 'lib-util-current-open-port-software.js';
import { autonuke } from 'lib-util-auto-nuke.js';
import { calcThreads } from 'lib-util-calc-threads.js';

export async function main(ns: BitBurner) {
  const srvList: { [key: string]: ServerInfo } = JSON.parse(
    ns.read('spider-servers.txt') as string
  );
  let looping = true;
  while (looping) {
    let hackLvl = ns.getHackingLevel();
    let portSoft = currentOpenPortSoftware(ns);

    for (let k in srvList) {
      let srv = srvList[k];
      if (
        (await autonuke(ns, srv.host, portSoft, hackLvl, srv.hackReq, srv.portReq)) &&
        !ns.fileExists('pwned.txt', srv.host)
      ) {
        if (srv.ram >= 32 && srv.maxMoney > 0) {
          autoScripts.forEach(it => {
            ns.scp(it, srv.host);
          });
          ns.exec('scripts-auto-spider.js', srv.host);
        } else if (srv.ram >= 4 && srv.maxMoney > 0) {
          ns.scp('scripts-starter-hack-yourself.js', srv.host);
          ns.exec(
            'scripts-starter-hack-yourself.js',
            srv.host,
            calcThreads(ns, srv.ram, 'scripts-starter-hack-yourself.js')
          );
        }
        ns.scp('pwned.txt', 'home', srv.host);
        ns.tprint(`PWNED ${srv.host}`);
      }
    }
    await ns.sleep(500);
  }
}
