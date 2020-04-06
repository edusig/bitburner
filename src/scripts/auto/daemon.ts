// Upgraded/Modified version (to Netscript v2 with typescript) of https://github.com/auto/bitburner/blob/master/daemon.js
import { BitBurner, BitNodeMultipliers } from 'bitburner';
import { ServerInfo } from 'lib-util-server-info.js';

// Glossary
// GR/WR = Grow Rate/Weaken Rate
// GP = Growth Percentage
// TNT = Threades Needed To
// CNT = Cycles Needed To
// ET = Estimated Time
// TH = Thread Hardening

export async function main(ns: BitBurner) {
  const hn = ns.getHostname();
  // Multipliers
  let { money: player$Mult, growth: playerGrowMult } = ns.getHackingMultipliers();

  // let { ScriptHackMoney, ServerGrowthRate: bitnodeGR, ServerWeakenRate: bitnodeWR } = ns.getBitNodeMultipliers();
  let ScriptHackMoney = 1.0;
  let bitnodeGR = 1.0;
  let bitnodeWR = 1.0;
  player$Mult = player$Mult * ScriptHackMoney;

  // Settings
  let pctSteal = 0.1;

  // Constants
  let unadjustedGR = 1.03;
  let maxGR = 1.0035;

  let TH = { growth: 0.004, hack: 0.002 };

  let weakenTP = 0.05 * bitnodeWR;

  // RAM amount to run this scripts
  let costs = { hack: 1.6, weaken: 1.6, grow: 1.6, scheduler: 5.0 };

  // In seconds
  let delay = { step: 7, w: 14, activation: 6, kill: 8 };

  let looping = true;
  let srv: ServerInfo = JSON.parse(ns.args[0]);
  while (looping) {
    let hackLvl = ns.getHackingLevel();
    let curSec = ns.getServerSecurityLevel(srv.host);
    const srvRam = ns.getServerRam(srv.host);
    const ramAvailable = (srvRam[0] = srvRam[1]);
    if (Math.floor(curSec) > Math.floor(srv.minSec)) {
      const weakenET = Math.round(ns.getWeakenTime(srv.host) * 1000) / 1000;
      const threadsReq = Math.ceil((curSec - srv.minSec) / weakenTP);
      const threadsUsed = Math.floor(ramAvailable / costs.weaken);
      if (threadsReq > 0 && threadsUsed > 0) {
        ns.tprint(`[${hn}] Server ${srv.host} is being weakened...`);
        ns.run('scripts-auto-weaken-target.js', threadsUsed, srv.host);
        await ns.sleep((weakenET + delay.activation + delay.kill) * 1000);
      }
    } else {
      const adjustedGR = Math.min(1 + (unadjustedGR - 1) / srv.minSec, maxGR);
      const srvGP = srv.growth / 100;
      let numServerGrowthCyclesAdjusted = srvGP * bitnodeGR * playerGrowMult;
      // let srvGrowth = Math.pow(adjustedGR, numServerGrowthCyclesAdjusted);

      let neededToMaxInit = srv.maxMoney / Math.max(ns.getServerMoneyAvailable(srv.host), 1);
      let neededToMax = 1 / (1 - pctSteal);

      let CNTGrowInit = Math.log(neededToMaxInit) / Math.log(adjustedGR);
      let CNTGrow = Math.log(neededToMax) / Math.log(adjustedGR);

      let TNTGrowInit = Math.ceil(CNTGrowInit / numServerGrowthCyclesAdjusted);
      // let totalGrowCostInit = TNTGrowInit * costs.grow;
      let TNTGrow = Math.ceil(CNTGrow / numServerGrowthCyclesAdjusted);
      let totalGrowCost = TNTGrow * costs.grow;

      let weakenET = Math.round(ns.getWeakenTime(srv.host) * 1000) / 1000;
      let growET = Math.round(ns.getGrowTime(srv.host) * 1000) / 1000;
      let hackET = Math.round(ns.getHackTime(srv.host) * 1000) / 1000;

      let diffMult = (100 - Math.min(100, srv.minSec)) / 100;
      let skillMult = (hackLvl - (srv.hackReq - 1)) / hackLvl;
      let pctMoneyHacked = Math.min(1, Math.max(0, diffMult * skillMult * (player$Mult / 240)));

      let TNTHack = Math.floor(pctSteal / pctMoneyHacked);
      let pctToStealForDisplay = Math.round(pctSteal * 100);
      let totalHackCost = TNTHack * costs.hack;

      let TNTWeakenForHack = Math.ceil((TNTHack * TH.hack) / weakenTP);
      // let totalWeakenCostForHack = TNTWeakenForHack * costs.weaken;

      let TNTWeakenForGrow = Math.ceil((TNTGrow * TH.growth) / weakenTP);
      let totalWeakenCostForGrow = TNTWeakenForGrow * costs.weaken;

      let totalCostForAllCycles =
        totalHackCost + TNTWeakenForHack + totalGrowCost + totalWeakenCostForGrow + costs.scheduler;

      let cyclesSupportedByRAM = Math.floor(ramAvailable / totalCostForAllCycles);

      let skipHackDueToCycleImperfection = false;
      if (weakenET / delay.w < cyclesSupportedByRAM && pctSteal < 0.9) {
        ns.print(
          `[${hn}] Based on ${delay.w} seconds w timing, percentage to steal of ${pctToStealForDisplay} is too low. Adjusting for next run-loop.`
        );
        pctSteal += 0.1;
        skipHackDueToCycleImperfection = true;
      } else if (cyclesSupportedByRAM === 0 && pctSteal > 0.02) {
        ns.print(
          `[${hn}] Current percentage to steal of ${pctSteal} is too high for even 1 cycle. Adjusting for next run-loop.`
        );
        pctSteal -= 0.1;
        skipHackDueToCycleImperfection = true;
      }

      if (TNTGrowInit > 0) {
        ns.run('scripts-auto-grow-target.js', Math.floor(ramAvailable / costs.grow), srv.host);
        ns.tprint(`[${hn}] Server ${srv.host} is being grown...`);
        await ns.sleep((growET + delay.activation + delay.kill) * 1000);
      } else if (!skipHackDueToCycleImperfection) {
        ns.tprint(
          `[${hn}] ${srv.host} --- Hack to ${pctToStealForDisplay}% x ${cyclesSupportedByRAM} cycles with a weaken execution time of ${weakenET}`
        );
        for (let i = 0; i < cyclesSupportedByRAM; i++) {
          let args = [
            JSON.stringify({
              target: srv.host,
              script: 'scripts-auto-hack-target.js',
              TNTWeaken: TNTWeakenForHack * cyclesSupportedByRAM,
              TNTRun: TNTHack,
              weakenDelay: weakenET - hackET - delay.step,
              i,
            }),
            JSON.stringify({
              target: srv.host,
              script: 'scripts-auto-grow-target.js',
              TNTWeaken: TNTWeakenForGrow * cyclesSupportedByRAM,
              TNTRun: TNTGrow,
              weakenDelay: weakenET - growET - delay.step,
              i,
            }),
          ];
          for (let j = 0; j < args.length; j++) {
            ns.run('scripts-auto-scheduler.js', 1, args[j]);
            await ns.sleep(delay.step * 1000);
          }
          i += cyclesSupportedByRAM;
        }
        await ns.sleep((weakenET + delay.activation + delay.kill) * 1000);
      }
    }
    await ns.sleep(500);
  }
}
