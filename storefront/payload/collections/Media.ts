import type { CollectionConfig } from 'payload/types';
import path from 'path';

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
    description: 'For images, videos, and other media files.',
  },
  access: {
    read: () => true, // Allow public read access
  },
  upload: {
    staticDir: path.resolve(__dirname, '../../media'), // Adjust path as needed relative to your Payload config
    // disableLocalStorage: true, // Consider using a cloud storage adapter for production
    adminThumbnail: 'thumbnail',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        // By specifying `undefined` or leaving it undefined, Payload will maintain the aspect ratio
        height: undefined,
        position: 'centre',
      }
    ],
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt Text (Descriptive text for screen readers & SEO)',
      type: 'text',
      required: true,
      // If this Media collection is localized, alt text should also be localized.
      // localized: true, 
    },
    // If Sanity hotspot data (for metaImage or other images) needs to be preserved, add fields here:
    // { name: 'hotspotX', type: 'number' },
    // { name: 'hotspotY', type: 'number' },
    // { name: 'cropWidth', type: 'number' },
    // { name: 'cropHeight', type: 'number' },
  ]
};
