import type { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";
import { payloadcmsProductSyncWorkflow } from "../workflows/payloadcms-sync-products";

export default async function payloadcmsProductSyncHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  await payloadcmsProductSyncWorkflow(container).run({
    input: {
      product_ids: [data.id],
    },
  });
}

export const config: SubscriberConfig = {
  event: ["product.created", "product.updated"],
  subscriberId: "payloadcms-product-sync-subscriber",
};
