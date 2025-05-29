import type { CollectionConfig } from 'payload/types';
import { getSeoFields } from '../fields/seo'; // Assuming seo.ts is in ../fields/
import { slugField } from '../fields/slug'; // We'll create this simple slug field utility

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title', // What field to use in lists, relationships etc.
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Product categories or general content categories.',
    // Enable ordering if Sanity schema had 'orderable: true'
    // defaultSort: 'title', // or 'sortOrder' if a manual sort field is added
  },
  // access: { // Define access controls as needed
  //   read: () => true,
  // },
  fields: [
    {
      name: 'title', // Corresponds to Sanity's 'title' or 'internalTitle'
      label: 'Category Title',
      type: 'text',
      required: true,
      localized: true, // Assuming titles can be localized
    },
    // slugField(), // Reusable slug field, generated from title
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      localized: true, // Assuming descriptions can be localized
    },
    // Add other fields from Sanity's 'category' schema here.
    // For example, if it had a parent category reference:
    // {
    //   name: 'parent',
    //   label: 'Parent Category',
    //   type: 'relationship',
    //   relationTo: 'categories',
    // },

    // SEO Fields (conditionally localized based on overall strategy)
    getSeoFields(true), // Assuming SEO fields should be localized

    // Common fields from Sanity's definePage helper
    {
      name: 'indexable',
      label: 'Indexable by Search Engines',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'If unchecked, this page will not be indexed by search engines.',
      }
    },
    slugField({sourceField: 'title', localized: true}), // Add slug field, localized
  ],
  // Enable versioning if needed
  // versions: {
  //   drafts: true,
  // },
};
