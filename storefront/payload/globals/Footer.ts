import type { GlobalConfig } from 'payload/types';

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: {
    group: 'Navigation',
    description: 'Site footer configuration, links, copyright text.',
  },
  fields: [
    {
      name: 'columns',
      label: 'Footer Link Columns',
      type: 'array',
      localized: true,
      fields: [
        {
          name: 'columnTitle',
          label: 'Column Title',
          type: 'text',
          required: true,
        },
        {
          name: 'links',
          label: 'Links',
          type: 'array',
          fields: [
            {
              name: 'label',
              label: 'Label',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              label: 'URL / Path',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'copyrightText',
      label: 'Copyright Text',
      type: 'text', // Or richText for more complex formatting including year shortcodes etc.
      required: true,
      localized: true,
      admin: {
        description: 'E.g., © {{year}} Your Company. All rights reserved.'
      }
    },
    {
      name: 'socialMediaLinks', // Re-use social links or have a dedicated set for footer
      label: 'Social Media Links (Footer)',
      type: 'array',
      localized: false, 
      fields: [
        // Re-populating options for clarity, though ideally these could come from a shared type/config
        { 
          name: 'platform', 
          label: 'Platform',
          type: 'select', 
          options: [ 
            { label: 'Facebook', value: 'facebook' },
            { label: 'Twitter', value: 'twitter' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
          ], 
          required: true 
        },
        { name: 'url', label: 'URL', type: 'url', required: true },
      ],
      admin: {
        description: 'Overrides global social links if specified here for the footer.'
      }
    }
    // Add other fields from Sanity's 'footer' singleton
  ],
};
