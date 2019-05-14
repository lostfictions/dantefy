import * as readline from "readline";

import { dantefy } from "./dantefy";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on("line", (message: string) =>
  dantefy({ url: message })
    .then(filename => {
      console.log(`file://${filename}\n`);
    })
    .catch(e => {
      console.error(e);
    })
);
