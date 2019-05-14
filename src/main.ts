require("source-map-support").install();

import { createReadStream } from "fs";
import Masto, { Status } from "masto";
import { dantefy } from "./dantefy";
import { MASTODON_SERVER, MASTODON_TOKEN } from "./env";

const TWOOT_TEXT = "featuring Dante from the Devil May Cry™ Series";

console.log(`[${new Date().toUTCString()}] Running in production mode!`);

(async () => {
  const masto = await Masto.login({
    uri: MASTODON_SERVER,
    accessToken: MASTODON_TOKEN
  });

  const ownAccount = await masto.verifyCredentials();

  const userEvents = await masto.streamUser();
  userEvents.on("notification", async notification => {
    if (notification.type !== "mention") return;

    if (
      notification.status &&
      notification.status.media_attachments.length > 0
    ) {
      const mediaPromises = notification.status.media_attachments
        .slice(0, 4)
        .map(attachment =>
          dantefy({
            url: attachment.url
          }).then(filename =>
            masto.uploadMediaAttachment({
              file: createReadStream(filename)
            })
          )
        );

      const accountsToMention = notification.status.mentions
        .map(mention => mention.acct)
        .filter(acct => acct !== ownAccount.acct)
        .concat(notification.status.account.acct)
        .map(acct => `@${acct}`)
        .join(" ");

      const statusText = `${accountsToMention} ${TWOOT_TEXT}`;

      const mediaObjects = await Promise.all(mediaPromises);

      const status = (await masto.createStatus({
        in_reply_to_id: notification.status.id,
        status: statusText,
        visibility: notification.status.visibility,
        media_ids: mediaObjects.map(m => m.id)
      })) as Status;

      console.log(`${statusText}\n${status.uri}\n`);
    }
  });

  console.log(`[${new Date().toUTCString()}] Listening for mentions!`);
})();
