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
  category_ids?: string[];
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
    if (isDefined(input.category_ids)) {
      filter.id = input.category_ids;
    }

    while (hasMore) {
      const [categories, count] =
        await productModule.listAndCountProductCategories(filter, {
          select: [
            "id",
            "name",
            "handle",
            "parent_category_id",
            "category_children.id",
          ],
          relations: ["category_children"],
          skip: offset,
          take: batchSize,
          order: { id: "ASC" },
        });

      await promiseAll(
        categories.map((prod) => {
          return payloadcmsModule.upsertSyncDocument("category", prod);
        }),
      );

      offset += batchSize;
      hasMore = offset < count;
      total += categories.length;
    }

    return new StepResponse({ total });
  },
);

const id = "payloadcms-category-sync";

export const payloadcmsCategorySyncWorkflow = wf(
  { name: id, retentionTime: 10000 },
  function (input: Input) {
    const result = syncStep(input);

    return new WorkflowResponse(result);
  },
);
