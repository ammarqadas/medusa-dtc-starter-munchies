import type { CollectionConfig } from 'payload/types';
import { slugField } from '../fields/slug';

export const FaqCategories: CollectionConfig = {
  slug: 'faq-categories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Categories for FAQ entries.',
  },
  fields: [
    {
      name: 'title',
      label: 'Category Title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        localized: true,
        required: false,
    },
    slugField({ sourceField: 'title', localized: true }),
  ],
};
