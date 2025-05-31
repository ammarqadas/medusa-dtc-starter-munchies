import { defineConfig, loadEnv, Modules } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV, process.cwd());

export default defineConfig({
  projectConfig: {
    redisUrl: process.env.REDIS_URL,
    databaseUrl: process.env.DATABASE_URL,
    databaseLogging: true,
    http: {
      storeCors: process.env.STORE_CORS,
      adminCors: process.env.ADMIN_CORS,
      authCors: process.env.AUTH_CORS,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
  },
  admin: {
    backendUrl: "https://munchies.medusajs.app",
    // backendUrl: "http://localhost:9000",
  },
  modules: [
    {
      resolve: "./modules/payloadcms", // Assuming this resolves to backend/src/modules/payloadcms/service.ts
      options: {
        api_key: process.env.PAYLOAD_API_KEY,
        api_endpoint: process.env.PAYLOAD_API_URL,
        // Add collection_slugs here if they are different from defaults, e.g.:
        // collection_slugs: {
        //   product: "custom-products",
        //   category: "custom-categories",
        //   collection: "custom-product-collections",
        // },
        // Add target_locale if needed, e.g.:
        // target_locale: "en-US",
      },
    },
    {
      resolve: "@medusajs/file",
      key: Modules.FILE,
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              authentication_method: "s3-iam-role",
              file_url: process.env.S3_FILE_URL,
              region: process.env.S3_REGION,
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT,
            },
          },
        ],
      },
    },
    {
      resolve: "@medusajs/medusa/payment",
      key: Modules.PAYMENT,
      options: {
        providers: [
          // {
          //   resolve: "@medusajs/medusa/payment-stripe",
          //   id: "stripe",
          //   options: {
          //     apiKey: process.env.STRIPE_API_KEY,
          //   },
          // },
        ],
      },
    },
  ],
});
