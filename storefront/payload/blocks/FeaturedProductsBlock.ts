import type { Block } from 'payload/types';
import { getCtaFields } from '../fields/cta';

export const FeaturedProductsBlock: Block = {
  slug: 'featuredProducts',
  labels: {
    singular: 'Featured Products Section',
    plural: 'Featured Products Sections',
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'products',
      label: 'Select Products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      required: true,
      minRows: 1,
      // Sanity schema didn't specify max, but can be added:
      // maxRows: 4, 
      admin: {
        description: 'Select products to feature in this section.'
      }
    },
    getCtaFields(), // Optional CTA for the section (e.g., "View All Products")
  ],
};
