import { BitBurner as NS } from 'bitburner';

export async function main(ns: NS) {
  const filter = ns.args.length > 0 ? ns.args[0] : undefined;
  // Notice:
  // Final names of the files on the game will be something like this:
  // scripts-auto-buy-srv.js
  let files = [
    'scripts/auto/buy-srv.js',
    'scripts/auto/daemon.js',
    'scripts/auto/grow-target.js',
    'scripts/auto/hack-target.js',
    'scripts/auto/hacknodes.js',
    'scripts/auto/nuke-found.js',
    'scripts/auto/run.js',
    'scripts/auto/scheduler.js',
    'scripts/auto/spider.js',
    'scripts/auto/start.js',
    'scripts/auto/weaken-target.js',
    'scripts/starter/hack-joe.js',
    'scripts/starter/hack-yourself.js',
    'scripts/starter/noob-hack.js',
    'lib/util/auto-nuke.js',
    'lib/util/calc-threads.js',
    'lib/util/constants.js',
    'lib/util/current-open-port-software.js',
    'lib/util/server-info.js',
    'scripts/wget-all.js',
  ];
  if (filter != null) {
    files = files.filter(it => it.includes(filter));
  }
  let i = 0;
  while (i < files.length) {
    let it = files[i];
    let url = `http://localhost:8000/${it}`;
    let file = it.replace(/\//gi, '-');
    ns.print(`Downloading ${url} to ${file} file`);
    console.log(`Downloading ${url} to ${file} file`);
    await ns.wget(url, file, 'home');
    await ns.sleep(500);
    i++;
  }
}
