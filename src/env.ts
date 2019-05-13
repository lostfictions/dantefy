import * as envalid from "envalid";

const env = envalid.cleanEnv(
  process.env,
  {
    MASTODON_SERVER: envalid.url({ default: "https://mastodon.social" }),
    MASTODON_TOKEN: envalid.str(),
    CRON_RULE: envalid.str({ default: "0 3,7,11,15,19,23 * * *" })
  },
  { strict: true }
);

export const { MASTODON_SERVER, MASTODON_TOKEN, CRON_RULE } = env;
