# Bitburner Scripts + Typescript + Local Server

A collection of [Bitburner](https://danielyxie.github.io/bitburner/) scripts written in Typescript with an express server. The express server enables you to download the scripts easily into the game.

## How to use

1. Transpile/Run Server
2. Download scripts to game
3. Start `auto.js`

### Requirements

Nodejs >= 10

### Transpiling and Starting Server

Clone this project and on your terminal run:

```bash
# Install dependencies
npm ci
# Transpile the code and start server
npm start
# The server will run locally on port 8000 (default)
```

### Downloading the scripts to the game

Run the `download` command inside the game's terminal passing the local server `wget-all.js` script. Then run the `wget-all.js` inside the game and wait for it to download all the scripts.

```bash
wget http://localhost:8000/scripts/wget-all.js scripts-wget-all.js
run scripts-wget-all.js
```

If needed you can filter the downloaded file (to speed up) using the first argument of the `wget-all.js` script

```bash
# Download files from the auto directory
run scripts-wget-all.js /auto/
# Download only the wget-all (updates it)
run scripts-wget-all.js wget-all
# Download only one of the scripts (updates it)
run scripts-wget-all.js hack-joe
```

Notice: since there is no directory structure inside the game the `wget-all.js` script will replace `/` for `-` so in game the file will be something like this: `scripts/starter/noob-hack.js` -> `scripts-starter-noob-hack.js`

## Directory Structure and Files

- lib
  - util
    - `auto-nuke.ts`: Uses all the programs to open ports and nuke the target.
    - `calc-threads.ts`: calculate the needed threads to run a script.
    - `constants.ts`: general constants.
    - `current-open-port-software.ts`: returns the current number of software to open ports.
    - `server-info.ts`: returns some info about a target host.
- scripts:
  - auto: a collection of scripts based on the [moriakaice](https://github.com/moriakaice/bitburner) repo:
    - `buy-srv.ts`: auto buy/upgrade personal servers.
    - `daemon.ts`: calculates what is best to do with a target, between weaken, grow or hack.
    - `grow-target.ts`: grows a single target.
    - `hack-target.ts`: hacks a single target.
    - `hacknodes.ts`: auto buy/upgrade hacknodes.
    - `nuke-found.ts`: auto nukes every host found by the `spider.ts`.
    - `run.ts`: main script that starts everything.
    - `scheduler.ts`: schedules weaken-hack or weaken-grow cycles.
    - `spider.ts`: scans network and maps all existing servers.
    - `start.ts`: calculates the best target to hack.
    - `weaken-target.ts`: weaken a single target.
  - starter: a collection of scripts from the getting starter page of the [documentation](https://bitburner.readthedocs.io/en/latest/guidesandtips/gettingstartedguideforbeginnerprogrammers.html):
    - `hack-joe.ts`: hacks joesguns.
    - `hack-yourself.ts`: hacks its own host.
    - `noob-hack.ts`: simple script to nuke a server then hack/grow/weaken.

## Creating and using Lib scripts

To ease the use of libs inside the game this project uses typescript path aliases. Check out the `tsconfig.json` for the list of lib aliases to use.

### To create a new lib just create a new file inside the `lib` directory and add to the path.

Example:

`tsconfig.json` :

```json
{
  "paths": {
    "lib-util-auto-nuke.js": ["src/lib/util/auto-nuke"],
    "lib-util-my-awesome-lib.js": ["src/lib/util/my-awesome-lib"]
  }
}
```

`myawesome-script.ts` :

```typescript
import { awesomeHack } from 'lib-util-my-awesome-lib.js';

export async function main(ns: BitBurner) {
  awesomeHack(ns, 'home?');
}
```

### To use the libs inside scripts just import the aliases.

Example:

`tsconfig.json` :

```json
{
  "paths": {
    "lib-util-auto-nuke.js": ["src/lib/util/auto-nuke"]
  }
}
```

`myawesome-script-to-nuke.ts` :

```typescript
import { autonuke } from 'lib-util-auto-nuke.js';

export async function main(ns: BitBurner) {
  autonuke(ns, 'home?', 0, 0, 0, 0);
}
```

## Contributing

Read the [CONTRIBUTING.md](CONTRIBUTING.md) file for more information.

## Code of Conduct

Read the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) file for more information.
