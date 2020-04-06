import { BitBurner, Host } from 'bitburner';

export interface ServerInfo {
  host: Host;
  portReq: number;
  hackReq: number;
  maxMoney: number;
  growth: number;
  minSec: number;
  ram: number;
}

export const serverInfo = (ns: BitBurner, host: Host): ServerInfo => {
  return {
    host,
    portReq: ns.getServerNumPortsRequired(host),
    hackReq: ns.getServerRequiredHackingLevel(host),
    maxMoney: ns.getServerMaxMoney(host),
    growth: ns.getServerGrowth(host),
    minSec: ns.getServerMinSecurityLevel(host),
    ram: ns.getServerRam(host)[0],
  };
};
