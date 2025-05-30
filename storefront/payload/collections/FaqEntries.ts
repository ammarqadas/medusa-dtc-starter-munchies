import type { CollectionConfig } from 'payload/types';

export const FaqEntries: CollectionConfig = {
  slug: 'faq-entries',
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'updatedAt'],
    description: 'Individual FAQ questions and answers.',
    defaultSort: 'question',
  },
  fields: [
    {
      name: 'question',
      label: 'Question',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'answer',
      label: 'Answer',
      type: 'richText', // Assuming answer can be rich text
      localized: true,
    },
    {
      name: 'category',
      label: 'FAQ Category',
      type: 'relationship',
      relationTo: 'faq-categories',
      required: true,
      // If FAQ entries should be sortable within a category, add a sortOrder field
    },
  ],
};
