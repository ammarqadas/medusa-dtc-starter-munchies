import type { GlobalConfig } from 'payload/types';
import { getSeoFields } from '../fields/seo';

export const FaqIndex: GlobalConfig = {
  slug: 'faq-index',
  admin: {
    group: 'Content',
    description: 'Settings or introductory content for the main FAQ page.',
  },
  fields: [
    {
      name: 'title',
      label: 'FAQ Page Title',
      type: 'text',
      localized: true,
    },
    {
      name: 'introduction',
      label: 'Introduction Text',
      type: 'richText',
      localized: true,
    },
    getSeoFields(true), // SEO for the FAQ index page itself
  ],
};
