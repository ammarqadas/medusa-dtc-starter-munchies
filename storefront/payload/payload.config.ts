import { buildConfig } from 'payload/config';
import path from 'path';
// import { mongooseAdapter } from '@payloadcms/db-mongodb';
// import { postgresAdapter } from '@payloadcms/db-postgres';
// import { slateEditor } from '@payloadcms/richtext-slate';

// Placeholder for future imports
// import { Users } from './collections/Users'; // Example User collection
import { Media } from './collections/Media'; // Example Media collection

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001', // Defaulting to 3001
  admin: {
    user: 'users', // Defaulting to a 'users' collection
    // webpack: (config) => ({
    //   ...config,
    //   resolve: {
    //     ...config.resolve,
    //     alias: {
    //       ...config.resolve.alias,
    //       // Ensure Payload uses its own React instance if Next.js causes conflicts.
    //       // Adjust path if your node_modules is elsewhere.
    //       // 'react': path.resolve(__dirname, '../../node_modules/react'), 
    //       // 'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
    //     },
    //   },
    // }),
  },
  collections: [
    // Users, // Example: Add a Users collection for authentication
    Media, // Example: Add a Media collection for uploads
  ],
  globals: [
    // ExampleGlobal,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  db: {
    // This is a placeholder. User needs to install and configure a database adapter.
    // For example, for MongoDB:
    // adapter: mongooseAdapter({ url: process.env.MONGODB_URI || 'mongodb://127.0.0.1/payload' }),
    // Or for PostgreSQL:
    // adapter: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL || 'postgresql://user:pass@localhost:5432/payload' } }),
    // If no adapter is specified, Payload will throw an error.
    // Consider adding a dummy adapter if you want the server to start without a real DB for initial setup,
    // but it's better to prompt the user to set up a proper DB.
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  // localization: {
  //   locales: [
  //     'en', // Default English
  //     // Add other locales here: e.g., 'es', 'fr'
  //   ],
  //   defaultLocale: 'en',
  //   fallback: true,
  // },
  // editor: slateEditor({}), // Example for configuring the Slate RichText editor
});
