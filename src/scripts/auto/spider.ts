// Upgraded/Modified version (to Netscript v2 with typescript) of https://github.com/moriakaice/bitburner/blob/master/spider.js
import { BitBurner } from 'bitburner';
import { serverInfo, ServerInfo } from 'lib-util-server-info.js';

export async function main(ns: BitBurner) {
  let hn = ns.getHostname();
  let servers: { [key: string]: ServerInfo } = {};
  let toSearch = [hn];
  while (toSearch.length > 0) {
    let target = toSearch.shift();
    if (!target.includes('pserv')) {
      servers[target] = serverInfo(ns, target);
      let newServers = ns.scan(target);
      newServers = newServers.filter(it => {
        return !Object.keys(servers).includes(it);
      });
      toSearch = toSearch.concat(newServers);
    }
  }
  delete servers['home'];
  ns.write('spider-servers.txt', JSON.stringify(servers), 'w');
  if (hn === 'home') {
    if (!ns.fileExists('pwned.txt')) {
      ns.write('pwned.txt', 'PWNED!!!!!!!!', 'w');
    }
    ns.exec('scripts-auto-nuke-found.js', hn);
  }
  ns.exec('scripts-auto-start.js', hn);
}
