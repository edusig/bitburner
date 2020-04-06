import { BitBurner } from 'bitburner';

export const calcThreads = (ns: BitBurner, srvRam: number, script: string, host = 'home') =>
  srvRam / ns.getScriptRam(script, host);
