import { BitBurner } from 'bitburner';
import { autoScripts } from 'lib-util-constants.js';

export async function main(ns: BitBurner) {
  const ramPrice = 55000;
  // Adjust this for your desired minimum starting RAM
  let ramToBuy = 1024;
  let $ = ns.getServerMoneyAvailable('home');
  while ($ > ramPrice * ramToBuy * 4) {
    ramToBuy = ramToBuy * 2;
  }
  ns.print(`Buying player servers. Target: ${ramToBuy}GB RAM for ${ramPrice * ramToBuy}$`);

  const maxServers = ns.getPurchasedServerLimit();
  let loop = true;
  let i = 0;
  while (loop) {
    $ = ns.getServerMoneyAvailable('home');
    if (i >= maxServers) {
      while ($ > ramPrice * ramToBuy * 8) {
        ramToBuy = ramToBuy * 4;
      }
      ns.print(`Buying player servers. Target: ${ramToBuy}GB RAM for ${ramPrice * ramToBuy}$`);
      i = 0;
      await ns.sleep(60000);
    } else {
      let hn = `pserv-${i}`;
      if ((!ns.serverExists(hn) || ns.getServerRam(hn)[0] < ramToBuy) && $ > ramPrice * ramToBuy) {
        if (ns.serverExists(hn)) {
          ns.tprint(`Shutting down server ${hn} to buy more RAM [${ramToBuy}]`);
          ns.killall(hn);
          await ns.sleep(20000);
          ns.deleteServer(hn);
          await ns.sleep(5000);
        } else {
          let host = ns.purchaseServer(hn, ramToBuy);
          ns.tprint(`Bought server ${hn} with ${ramToBuy}GB of RAM`);
          if (ramToBuy >= 32) {
            autoScripts.forEach((it) => {
              ns.scp(it, host);
            });
            ns.exec('scripts-auto-daemon.js', host);
          } else {
            ns.scp('lib-util-auto-nuke.js', host);
            ns.scp('lib-util-current-open-port-software.js', host);
            ns.scp('lib-util-constants.js', host);
            ns.scp('lib-util-server-info.js', host);
            ns.scp('scripts-starter-hack-joe.js', host);
            ns.exec(
              'scripts-starter-hack-joe.js',
              host,
              Math.floor(
                ns.getServerRam(host)[0] / ns.getScriptRam('scripts-starter-hack-joe.js', host)
              )
            );
          }

          i++;
        }
      } else {
        i++;
      }
    }
    await ns.sleep(500);
  }
}
