require("source-map-support").install();

import { scheduleJob } from "node-schedule";
import { twoot, Configs as TwootConfigs } from "twoot";

import { dantefy } from "./dantefy";

import { MASTODON_SERVER, MASTODON_TOKEN, CRON_RULE } from "./env";

const TWOOT_TEXT = "featuring Dante from the Devil May Cry™ Series";

// FIXME
const TEST_URL =
  "https://upload.wikimedia.org/wikipedia/commons/5/54/Krzywik.jpg";

const twootConfigs: TwootConfigs = [
  {
    token: MASTODON_TOKEN,
    server: MASTODON_SERVER
  }
];

async function doTwoot(): Promise<void> {
  const filename = await dantefy({ url: TEST_URL });
  try {
    const urls = await twoot(twootConfigs, TWOOT_TEXT, [filename]);
    for (const url of urls) {
      console.log(`twooted at '${url}'!`);
    }
  } catch (e) {
    console.error("error while trying to twoot: ", e);
  }
}

const argv = process.argv.slice(2);

if (argv.includes("local")) {
  const localJob = () =>
    dantefy({ url: TEST_URL }).then(async filename => {
      console.log(`${TWOOT_TEXT} file://${filename}\n`);
      // if (!argv.includes("once")) {
      //   setTimeout(localJob, 5000);
      // }
    });

  localJob();
  console.log("Running locally!");
} else {
  // we're running in production mode!
  if (argv.includes("once")) {
    console.log("Running single iteration!");
    doTwoot().then(() => console.log("Done."));
  } else {
    const job = scheduleJob(CRON_RULE, () => {
      doTwoot().then(() => {
        setTimeout(() => {
          const next = (job.nextInvocation() as any).toDate().toUTCString(); // bad typings
          console.log(`Next job scheduled for [${next}]`);
        });
      });
    });
    const now = new Date(Date.now()).toUTCString();
    const next = (job.nextInvocation() as any).toDate().toUTCString(); // bad typings
    console.log(`[${now}] Bot is running! Next job scheduled for [${next}]`);
  }
}
