import type { Block } from 'payload/types';
import { getCtaFields } from '../fields/cta'; // Assuming cta.ts is in ../fields/

export const CenteredTextBlock: Block = {
  slug: 'centeredText',
  labels: {
    singular: 'Centered Text Section',
    plural: 'Centered Text Sections',
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      localized: true,
      admin: {
        description: 'Optional title for the section.'
      }
    },
    {
      name: 'content', // Was 'text' in Sanity schema, 'content' is more descriptive for richText
      label: 'Content',
      type: 'richText', // Assuming this can be rich text
      required: true,
      localized: true,
    },
    getCtaFields(), // Embed CTA fields (label, url)
  ],
};
