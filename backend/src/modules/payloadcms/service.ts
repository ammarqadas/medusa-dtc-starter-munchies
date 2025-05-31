import {
  ModuleJoinerConfig,
  ProductCategoryDTO,
  ProductCollectionDTO,
  ProductDTO,
  ProductVariantDTO,
  ImageDTO, // Added for potential future use or logging
} from "@medusajs/types";
import { MedusaError, isString } from "@medusajs/utils";
import fetch, { Response } from "node-fetch"; // Using node-fetch

// --- Constants ---
const SYNC_DOCUMENT_TYPES = {
  PRODUCT: "product",
  CATEGORY: "category",
  COLLECTION: "collection",
} as const;

type SyncDocumentType =
  (typeof SYNC_DOCUMENT_TYPES)[keyof typeof SYNC_DOCUMENT_TYPES];

type SyncDocumentInput<T extends SyncDocumentType> = T extends "product"
  ? ProductDTO
  : T extends "category"
  ? ProductCategoryDTO
  : T extends "collection"
  ? ProductCollectionDTO
  : never;

// --- PayloadCMS Specific Types (adjust as per your PayloadCMS setup) ---
interface PayloadDocument {
  id: string; // Payload's internal ID
  medusaId: string;
  [key: string]: any; // Allow other fields
}

interface PayloadQueryResponse<TDoc extends PayloadDocument> {
  docs: TDoc[];
  totalDocs: number;
  limit: number;
  page?: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
  nextPage?: number | null;
  prevPage?: number | null;
}

// --- Options and Dependencies ---
type PayloadCMSModuleOptions = {
  apiKey?: string; // Optional here, will check from env
  apiEndpoint?: string; // Optional here, will check from env
  defaultLocale?: string; // e.g., "en_US" or "en-US"
  collectionSlugs?: {
    product?: string;
    category?: string;
    collection?: string;
  };
  // Add specific field mapping options if needed later
};

type InjectedDependencies = {}; // For potential Medusa services

export default class PayloadCMSModuleService {
  protected readonly apiKey_: string;
  protected readonly apiEndpoint_: string;
  protected readonly defaultLocale_: string;
  protected readonly collectionSlugs_: {
    product: string;
    category: string;
    collection: string;
  };

  // Stores Payload document IDs against Medusa IDs for quick lookup if needed
  // private medusaToPayloadIdMap_: Map<SyncDocumentType, Map<string, string>> = new Map();

  constructor(
    deps: InjectedDependencies,
    options: PayloadCMSModuleOptions = {}
  ) {
    this.apiKey_ = options.apiKey || process.env.PAYLOADCMS_API_KEY!;
    this.apiEndpoint_ =
      options.apiEndpoint || process.env.PAYLOADCMS_API_ENDPOINT!;
    this.defaultLocale_ = options.defaultLocale || "en"; // Default to 'en'

    if (!this.apiKey_ || !this.apiEndpoint_) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "PayloadCMS API Key and API Endpoint are required. Provide them in options or as environment variables (PAYLOADCMS_API_KEY, PAYLOADCMS_API_ENDPOINT)."
      );
    }

    this.collectionSlugs_ = {
      product: options.collectionSlugs?.product || "products",
      category: options.collectionSlugs?.category || "categories",
      collection:
        options.collectionSlugs?.collection || "product-collections",
    };

    // Initialize maps for each type
    // this.medusaToPayloadIdMap_.set(SYNC_DOCUMENT_TYPES.PRODUCT, new Map());
    // this.medusaToPayloadIdMap_.set(SYNC_DOCUMENT_TYPES.CATEGORY, new Map());
    // this.medusaToPayloadIdMap_.set(SYNC_DOCUMENT_TYPES.COLLECTION, new Map());
  }

  private async _fetch<T = any>(
    path: string,
    method: "GET" | "POST" | "PATCH" | "DELETE",
    body?: Record<string, any>
  ): Promise<T> {
    const url = `${this.apiEndpoint_.replace(/\/$/, "")}/api/${path.replace(
      /^\//,
      ""
    )}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `users API-Key ${this.apiKey_}`, // Common for PayloadCMS
      // Add locale header if your Payload setup requires it for field-level localization
      // "Accept-Language": this.defaultLocale_,
    };

    console.log(`PayloadCMS Request: ${method} ${url}`, body ? JSON.stringify(body, null, 2) : '');


    try {
      const response: Response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`PayloadCMS API Error (${response.status} ${response.statusText}) for ${method} ${url}:`, errorBody);
        throw new MedusaError(
          MedusaError.Types.UNEXPECTED_STATE,
          `PayloadCMS API request failed with status ${response.status}: ${errorBody}`
        );
      }
      if (response.status === 204 /* No Content */ || response.headers.get("content-length") === "0" ) {
        return {} as T; // Or handle as appropriate for DELETE etc.
      }
      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof MedusaError) throw error;
      console.error(`PayloadCMS Fetch Error for ${method} ${url}:`, error);
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to communicate with PayloadCMS: ${error.message}`
      );
    }
  }

  private getCollectionSlug(type: SyncDocumentType): string {
    switch (type) {
      case SYNC_DOCUMENT_TYPES.PRODUCT:
        return this.collectionSlugs_.product;
      case SYNC_DOCUMENT_TYPES.CATEGORY:
        return this.collectionSlugs_.category;
      case SYNC_DOCUMENT_TYPES.COLLECTION:
        return this.collectionSlugs_.collection;
      default:
        throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          `Unknown document type: ${type}`
        );
    }
  }

  private async findExistingPayloadDocument(
    collectionSlug: string,
    medusaId: string
  ): Promise<PayloadDocument | null> {
    // Construct query parameters carefully for PayloadCMS
    // This assumes you have a field named 'medusaId' which is queryable and unique.
    // Also assuming 'medusaId' is indexed in PayloadCMS for performance.
    const queryParams = new URLSearchParams({
      where: `[medusaId][equals]=${medusaId}`,
      limit: "1",
      depth: "0", // We only need the ID, not populated relationships
      locale: this.defaultLocale_, // Ensure we query the correct locale if applicable
      draft: "false", // Ensure we query published documents
    }).toString();

    const response = await this._fetch<PayloadQueryResponse<PayloadDocument>>(
      `${collectionSlug}?${queryParams}`,
      "GET"
    );

    if (response.docs && response.docs.length > 0) {
      return response.docs[0];
    }
    return null;
  }

  async upsertSyncDocument<T extends SyncDocumentType>(
    type: T,
    data: SyncDocumentInput<T>
  ): Promise<PayloadDocument> {
    if (!data.id) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, `Cannot sync document of type ${type} without an ID.`);
    }
    const collectionSlug = this.getCollectionSlug(type);
    const medusaId = data.id;

    try {
      const existingPayloadDoc = await this.findExistingPayloadDocument(
        collectionSlug,
        medusaId
      );

      if (existingPayloadDoc) {
        return await this.updateSyncDocument(
          type,
          existingPayloadDoc.id, // Use Payload's internal ID for updates
          data
        );
      } else {
        return await this.createSyncDocument(type, data);
      }
    } catch (error) {
        if (error instanceof MedusaError) throw error;
        console.error(`Error in upsertSyncDocument for ${type} ID ${medusaId}:`, error);
        throw new MedusaError(
            MedusaError.Types.UNEXPECTED_STATE,
            `Failed to upsert document type ${type} with Medusa ID ${medusaId} in PayloadCMS: ${error.message}`
        );
    }
  }

  private getLocalizedValue(value: any, fieldName: string): any {
    if (typeof value === "object" && value !== null && this.defaultLocale_ in value) {
        return value[this.defaultLocale_];
    }
    // If not an object or locale not found, return the value as is,
    // assuming it might be a non-localized field or already in the correct format.
    // console.warn(`Field '${fieldName}' does not seem to be localized or locale '${this.defaultLocale_}' not found. Using raw value.`);
    return value;
  }


  async createSyncDocument<T extends SyncDocumentType>(
    type: T,
    data: SyncDocumentInput<T>
  ): Promise<PayloadDocument> {
    const collectionSlug = this.getCollectionSlug(type);
    const transformedData = this._transformDataForCreate(type, data);

    // Add locale if your collection is localized and requires it on create
    // Depending on Payload setup, locale might be part of the path or body
    // For field-level localization, it's often set per field or via header
    // For collection-level localization (different docs per locale), this might be different.
    // This example assumes field-level localization where Payload handles it based on header or specific field format.

    // If your Payload collection has a top-level 'locale' field you need to set:
    // transformedData.locale = this.defaultLocale_;

    try {
      const newDoc = await this._fetch<PayloadDocument>(
        collectionSlug, // Path might need locale: `${collectionSlug}?locale=${this.defaultLocale_}`
        "POST",
        transformedData
      );
      // this.medusaToPayloadIdMap_.get(type)?.set(data.id, newDoc.id);
      return newDoc;
    } catch (error) {
        if (error instanceof MedusaError) throw error;
        console.error(`Error in createSyncDocument for ${type} ID ${data.id}:`, error);
        throw new MedusaError(
            MedusaError.Types.UNEXPECTED_STATE,
            `Failed to create document type ${type} with Medusa ID ${data.id} in PayloadCMS: ${error.message}`
        );
    }
  }

  async updateSyncDocument<T extends SyncDocumentType>(
    type: T,
    payloadId: string, // PayloadCMS's internal document ID
    data: SyncDocumentInput<T>
  ): Promise<PayloadDocument> {
    const collectionSlug = this.getCollectionSlug(type);
    const transformedData = this._transformDataForUpdate(type, data);

    // Similar to create, locale might be needed in path or body for updates
    // Example path: `${collectionSlug}/${payloadId}?locale=${this.defaultLocale_}`
    try {
      return await this._fetch<PayloadDocument>(
        `${collectionSlug}/${payloadId}`, // Path might need locale
        "PATCH",
        transformedData
      );
    } catch (error) {
        if (error instanceof MedusaError) throw error;
        console.error(`Error in updateSyncDocument for ${type} ID ${data.id} (Payload ID ${payloadId}):`, error);
        throw new MedusaError(
            MedusaError.Types.UNEXPECTED_STATE,
            `Failed to update document type ${type} with Medusa ID ${data.id} (Payload ID ${payloadId}) in PayloadCMS: ${error.message}`
        );
    }
  }

  async deleteSyncDocument(
    type: SyncDocumentType,
    medusaId: string
  ): Promise<void> {
    const collectionSlug = this.getCollectionSlug(type);
    try {
      const existingPayloadDoc = await this.findExistingPayloadDocument(
        collectionSlug,
        medusaId
      );

      if (existingPayloadDoc) {
        // Locale might be needed for delete operation as well
        // Example path: `${collectionSlug}/${existingPayloadDoc.id}?locale=${this.defaultLocale_}`
        await this._fetch<void>(
          `${collectionSlug}/${existingPayloadDoc.id}`, // Path might need locale
          "DELETE"
        );
        // this.medusaToPayloadIdMap_.get(type)?.delete(medusaId);
        console.log(`Successfully deleted document of type ${type} with Medusa ID ${medusaId} (Payload ID ${existingPayloadDoc.id}) from PayloadCMS.`);
      } else {
        console.warn(
          `Document with Medusa ID ${medusaId} not found in PayloadCMS collection ${collectionSlug} for deletion. Skipping.`
        );
      }
    } catch (error) {
        if (error instanceof MedusaError) throw error;
        console.error(`Error in deleteSyncDocument for type ${type}, Medusa ID ${medusaId}:`, error);
        throw new MedusaError(
            MedusaError.Types.UNEXPECTED_STATE,
            `Failed to delete document type ${type} with Medusa ID ${medusaId} from PayloadCMS: ${error.message}`
        );
    }
  }

  // --- Transformation Dispatchers ---
  private _transformDataForCreate<T extends SyncDocumentType>(
    type: T,
    data: SyncDocumentInput<T>
  ): Record<string, any> {
    switch (type) {
      case SYNC_DOCUMENT_TYPES.PRODUCT:
        return this._transformProduct(data as ProductDTO, true);
      case SYNC_DOCUMENT_TYPES.CATEGORY:
        return this._transformCategory(data as ProductCategoryDTO, true);
      case SYNC_DOCUMENT_TYPES.COLLECTION:
        return this._transformCollection(data as ProductCollectionDTO, true);
      default:
        throw new MedusaError(MedusaError.Types.INVALID_ARGUMENT, `Unknown document type for transformation: ${type}`);
    }
  }

  private _transformDataForUpdate<T extends SyncDocumentType>(
    type: T,
    data: SyncDocumentInput<T>
  ): Record<string, any> {
    switch (type) {
      case SYNC_DOCUMENT_TYPES.PRODUCT:
        return this._transformProduct(data as ProductDTO, false);
      case SYNC_DOCUMENT_TYPES.CATEGORY:
        return this._transformCategory(data as ProductCategoryDTO, false);
      case SYNC_DOCUMENT_TYPES.COLLECTION:
        return this._transformCollection(data as ProductCollectionDTO, false);
      default:
        throw new MedusaError(MedusaError.Types.INVALID_ARGUMENT, `Unknown document type for transformation: ${type}`);
    }
  }

  // --- Specific Transformation Functions ---

  // Helper to build localized fields for Payload
  private _buildLocalizedPayloadField(value: string | undefined | null): Record<string, string | null> | string | null {
    if (value === undefined || value === null) return null; // Or handle as per Payload's requirements for empty localized fields
    // This assumes your Payload field is set up for localization
    // and expects an object like { "en": "value", "fr": "valeur" }
    // If your Payload field is NOT localized, just return `value`.
    return { [this.defaultLocale_]: value };

    // If your Payload field is NOT localized, use this instead:
    // return value;
  }


  private _transformProduct(
    product: ProductDTO,
    isCreate: boolean
  ): Record<string, any> {
    const payloadProduct: Record<string, any> = {
      // Base fields, always include medusaId for linking
      // medusaId is critical for `findExistingPayloadDocument`
      ...(isCreate ? { medusaId: product.id } : {}),
      title: this._buildLocalizedPayloadField(product.title),
      // Assuming Medusa `handle` maps to Payload `slug`
      slug: product.handle, // Slugs in Payload are usually not localized at field level but unique
      description: this._buildLocalizedPayloadField(product.description),
      status: product.status, // Assuming 'status' field exists and uses same values
      // subtitle: this._buildLocalizedPayloadField(product.subtitle),
      // is_giftcard: product.is_giftcard,
      // discountable: product.discountable,

      // Skipping images, variants, options for now as per instructions
      // medusa_images: product.images?.map(img => img.url) || [], // Example if sending image URLs
      // medusa_variants: product.variants?.map(this._transformVariant) || [], // Example
    };

    // Add more complex transformations here if needed
    // e.g., mapping categories/collections if they are already synced and you have their Payload IDs

    // Remove undefined fields to avoid sending them in PATCH or POST
    Object.keys(payloadProduct).forEach(key => {
        if (payloadProduct[key] === undefined) {
            delete payloadProduct[key];
        }
        // For localized fields, ensure the locale object isn't just { en: undefined }
        if (typeof payloadProduct[key] === 'object' && payloadProduct[key] !== null && this.defaultLocale_ in payloadProduct[key] && payloadProduct[key][this.defaultLocale_] === undefined) {
             // If you want to send null to clear a localized field:
             // payloadProduct[key][this.defaultLocale_] = null;
             // Or delete the field if undefined means "no change" for PATCH
             delete payloadProduct[key];
        }
    });


    return payloadProduct;
  }

  // private _transformVariant(variant: ProductVariantDTO): Record<string, any> {
  //   return {
  //     medusaId: variant.id,
  //     title: this._buildLocalizedPayloadField(variant.title),
  //     sku: variant.sku,
  //     barcode: variant.barcode,
  //     ean: variant.ean,
  //     upc: variant.upc,
  //     inventory_quantity: variant.inventory_quantity,
  //     allow_backorder: variant.allow_backorder,
  //     manage_inventory: variant.manage_inventory,
  //     // Add prices, options etc. as needed, potentially transformed
  //   };
  // }

  private _transformCategory(
    category: ProductCategoryDTO,
    isCreate: boolean
  ): Record<string, any> {
    const payloadCategory: Record<string, any> = {
      ...(isCreate ? { medusaId: category.id } : {}),
      // Assuming Medusa `category.name` maps to Payload `title` (or `name`)
      // And Medusa `category.handle` maps to Payload `slug`
      title: this._buildLocalizedPayloadField(category.name),
      slug: category.handle, // Slugs usually not localized
      description: this._buildLocalizedPayloadField(category.description),
      // parent_category_medusa_id: category.parent_category_id, // For potential linking later
      // mpath: category.mpath, // If you need to store the materialized path
    };

    Object.keys(payloadCategory).forEach(key => {
        if (payloadCategory[key] === undefined) {
            delete payloadCategory[key];
        }
         if (typeof payloadCategory[key] === 'object' && payloadCategory[key] !== null && this.defaultLocale_ in payloadCategory[key] && payloadCategory[key][this.defaultLocale_] === undefined) {
             delete payloadCategory[key];
        }
    });

    return payloadCategory;
  }

  private _transformCollection(
    collection: ProductCollectionDTO,
    isCreate: boolean
  ): Record<string, any> {
    const payloadCollection: Record<string, any> = {
      ...(isCreate ? { medusaId: collection.id } : {}),
      title: this._buildLocalizedPayloadField(collection.title),
      slug: collection.handle, // Slugs usually not localized
      // Add other collection fields as needed
    };

    Object.keys(payloadCollection).forEach(key => {
        if (payloadCollection[key] === undefined) {
            delete payloadCollection[key];
        }
        if (typeof payloadCollection[key] === 'object' && payloadCollection[key] !== null && this.defaultLocale_ in payloadCollection[key] && payloadCollection[key][this.defaultLocale_] === undefined) {
             delete payloadCollection[key];
        }
    });
    return payloadCollection;
  }

  // --- ModuleJoinerConfig ---
  __joinerConfig(): ModuleJoinerConfig {
    return {
      serviceName: "payloadcms", // Unique service name
      primaryKeys: ["id"], // Medusa's internal ID for entities this service might "own" or primarily manage
      linkableKeys: {
        // Define how other modules can link to entities managed or known by this service
        // 'medusa_id' is a common pattern for a custom field in Payload to store Medusa ID
        medusaId: "string", // This implies that other services can link using a 'medusaId' field.
      },
      alias: [
        { name: "payloadcms" },
        { name: "payloadCms" },
        { name: "payloadCMS" }, // Common casing
      ],
    };
  }
}
