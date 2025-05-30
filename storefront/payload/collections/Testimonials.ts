import type { CollectionConfig } from 'payload/types';

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['quoteSnippet', 'authorName', 'company', 'updatedAt'],
    description: 'Customer testimonials.',
  },
  fields: [
    {
      name: 'quote',
      label: 'Quote',
      type: 'textarea', // Or richText if quotes can have formatting
      required: true,
      localized: true,
    },
    {
        name: 'quoteSnippet', // For admin list display
        label: 'Quote Snippet',
        type: 'text',
        admin: { readOnly: true, hidden: true }, // Hidden in detail, used for list
        hooks: {
            beforeChange: [({ siblingData }) => { delete siblingData.quoteSnippet; }], // Prevent saving
            afterRead: [({ data }) => (data?.quote && typeof data.quote === 'string' ? data.quote.substring(0, 50) + '...' : '')]
        }
    },
    {
      name: 'authorName',
      label: 'Author Name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'company', // Or 'role', 'location' etc.
      label: 'Company / Role',
      type: 'text',
      localized: true,
    },
    {
        name: 'authorImage',
        label: 'Author Image',
        type: 'upload',
        relationTo: 'media',
        localized: false, // Typically author image is not localized
    }
    // If testimonials are tied to specific products or pages, add relationship fields.
  ],
};
