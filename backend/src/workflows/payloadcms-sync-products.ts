import { isDefined, Modules, promiseAll } from "@medusajs/framework/utils";
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { FilterableProductProps } from "@medusajs/types";
import PayloadCMSModuleService from "../modules/payloadcms/service";

const step = createStep;
const wf = createWorkflow;

type Input = {
  product_ids?: string[];
};

const syncStep = step(
  { name: "syncStep", async: true },
  async (input: Input, { container }) => {
    const productModule = container.resolve(Modules.PRODUCT);
    const payloadcmsModule: PayloadCMSModuleService = container.resolve("payloadcms");

    let total = 0;

    const batchSize = 200;
    let hasMore = true;
    let offset = 0;
    let filter: FilterableProductProps = {};
    if (isDefined(input.product_ids)) {
      filter.id = input.product_ids;
    }

    while (hasMore) {
      const [products, count] = await productModule.listAndCountProducts(
        filter,
        {
          select: ["id", "handle", "title"],
          skip: offset,
          take: batchSize,
          order: { id: "ASC" },
        },
      );

      await promiseAll(
        products.map((prod) => {
          return payloadcmsModule.upsertSyncDocument("product", prod);
        }),
      );

      offset += batchSize;
      hasMore = offset < count;
      total += products.length;
    }

    return new StepResponse({ total });
  },
);

const id = "payloadcms-product-sync";

export const payloadcmsProductSyncWorkflow = wf(
  { name: id, retentionTime: 10000 },
  function (input: Input) {
    const result = syncStep(input);

    return new WorkflowResponse(result);
  },
);
