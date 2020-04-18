// Upgraded/Modified version (to Netscript v2 with typescript) of https://github.com/moriakaice/bitburner/blob/master/hack-scheduler.js
import { BitBurner } from 'bitburner';

export async function main(ns: BitBurner) {
  const { target, script, TNTWeaken, TNTRun, weakenDelay, i } = JSON.parse(ns.args[0]);
  console.log('SCHEDULER', target, script, TNTWeaken, TNTRun, weakenDelay, i);
  if (TNTWeaken > 0) {
    ns.run('scripts-auto-weaken-target.js', TNTWeaken, target, i, script);
    await ns.sleep(weakenDelay);
  }
  if (TNTRun > 0) {
    ns.run(script, TNTRun, target, i, '');
  }
}
