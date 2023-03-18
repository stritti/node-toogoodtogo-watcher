﻿import _ from "lodash";
import got from "got";
import { config } from "../config.js";
import { formatInterval } from "./message-renderer.js";

const options = config.get("notifications.pushsafer") || {};

export async function notifyPushsafer( businesses) {
  console.log(businesses)

  businesses.forEach((business ) => {
    console.log(business.item.cover_picture)

    let message = `💰 ${(business.item.price_including_taxes.minor_units / 100).toFixed(2)}
🥡 ${business.items_available}
⏰ ${formatInterval(business)}

${business.item.description}`

    try {
      got.post('https://www.pushsafer.com/api', {
        form: {
          t: `Too Good To Go: ${business.display_name}`,
          m: message,
          u: `https://share.toogoodtogo.com/item/${business.item.item_id}`,
          ut: `${business.display_name}`,
          pr: 1,
          p: 'data:image/png;base64,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',
          i: 79,
          k: options.apiKey,
        },
      });
    } catch (error) {
      console.error(`Error when trying to send notification via Pushsafer:
${error.response.statusCode} (${error.response.statusMessage})
${error.response.body}`);
    }
  });
}