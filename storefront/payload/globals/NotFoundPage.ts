import type { GlobalConfig } from 'payload/types';
import { getSeoFields } from '../fields/seo'; // Usually 404 pages are not indexed, but good for consistency

export const NotFoundPage: GlobalConfig = {
  slug: 'not-found-page',
  admin: {
    group: 'Content',
    description: 'Content for the 404 Not Found page.',
  },
  fields: [
    {
      name: 'title',
      label: '404 Page Title',
      type: 'text',
      defaultValue: 'Page Not Found',
      required: true,
      localized: true,
    },
    {
      name: 'message',
      label: 'Message to Display',
      type: 'richText',
      required: true,
      localized: true,
    },
    // SEO for 404 page (often set to no-index via robots meta elsewhere, but fields can exist)
    getSeoFields(true), 
  ],
};
