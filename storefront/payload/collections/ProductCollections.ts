import type { CollectionConfig } from 'payload/types';
import { getSeoFields } from '../fields/seo';
import { slugField } from '../fields/slug';

export const ProductCollections: CollectionConfig = {
  slug: 'product-collections', // Renamed from 'collections' to be specific
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Collections or groups of products.',
  },
  fields: [
    {
      name: 'title',
      label: 'Collection Title',
      type: 'text',
      required: true,
      localized: true,
    },
    // Add other fields from Sanity's 'collection' schema, e.g., description, image
    {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        localized: true,
    },
    {
        name: 'collectionImage', // Example field if Sanity schema had an image
        label: 'Collection Image',
        type: 'upload',
        relationTo: 'media',
        localized: true, // If image can vary by locale
    },
    getSeoFields(true),
    {
      name: 'indexable',
      label: 'Indexable by Search Engines',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    slugField({ sourceField: 'title', localized: true }),
  ],
};
