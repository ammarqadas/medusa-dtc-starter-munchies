import type { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";
import { payloadcmsCollectionSyncWorkflow } from "../workflows/payloadcms-sync-collections";

export default async function payloadcmsCollectionSyncHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  await payloadcmsCollectionSyncWorkflow(container).run({
    input: {
      collection_ids: [data.id],
    },
  });
}

export const config: SubscriberConfig = {
  event: ["product-collection.created", "product-collection.updated"],
  subscriberId: "payloadcms-collection-sync-subscriber",
};
