import type { CollectionConfig } from 'payload/types';
import { getSeoFields } from '../fields/seo';
import { slugField } from '../fields/slug';
// Assuming TextPage uses a simpler rich text editor, or specific fields
// For now, let's use a basic rich text. Payload allows configuring multiple editor types if needed.

export const TextPages: CollectionConfig = {
  slug: 'text-pages', // For simple text-based pages
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Simpler text-focused pages (e.g., terms, privacy).',
  },
  fields: [
    {
      name: 'title',
      label: 'Page Title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'content',
      label: 'Page Content',
      type: 'richText', // Could be 'lightPtBody' equivalent if we define a separate editor for it
      localized: true,
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
  // versions: { drafts: true },
};
