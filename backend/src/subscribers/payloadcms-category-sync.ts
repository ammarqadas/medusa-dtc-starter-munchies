import type { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";
import { payloadcmsCategorySyncWorkflow } from "../workflows/payloadcms-sync-categories";

export default async function payloadcmsCategorySyncHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  await payloadcmsCategorySyncWorkflow(container).run({
    input: {
      category_ids: [data.id],
    },
  });
}

export const config: SubscriberConfig = {
  event: ["product-category.created", "product-category.updated"],
  subscriberId: "payloadcms-category-sync-subscriber",
};
