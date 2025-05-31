import {
  parallelize,
  createWorkflow as wf,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { payloadcmsCategorySyncWorkflow } from "./payloadcms-sync-categories";
import { payloadcmsCollectionSyncWorkflow } from "./payloadcms-sync-collections";
import { payloadcmsProductSyncWorkflow } from "./payloadcms-sync-products";

type Input = {
  category_ids?: string[];
  product_ids?: string[];
  collection_ids?: string[];
};

const id = "payloadcms-full-sync";

export const payloadcmsFullSyncWorkflow = wf(
  { name: id, retentionTime: 10000 },
  function (input: Input) {
    const [product_total, category_total, collection_total] = parallelize(
      payloadcmsProductSyncWorkflow.runAsStep({
        input: { product_ids: input.product_ids },
      }),
      payloadcmsCategorySyncWorkflow.runAsStep({
        input: { category_ids: input.category_ids },
      }),
      payloadcmsCollectionSyncWorkflow.runAsStep({
        input: { collection_ids: input.collection_ids },
      }),
    );
    return new WorkflowResponse({
      product_total,
      category_total,
      collection_total,
    });
  },
);
