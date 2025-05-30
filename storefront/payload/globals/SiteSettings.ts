import type { GlobalConfig } from 'payload/types';
import { getSeoFields } from '../fields/seo'; // Assuming seo.ts is in ../fields/

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  admin: {
    group: 'Configuration', // Group globals in admin UI
    description: 'Global site settings, default SEO, social media links, etc.',
  },
  // access: { read: () => true }, // Define access controls
  fields: [
    {
      name: 'siteName',
      label: 'Site Name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'siteDescription',
      label: 'Site Baseline / Tagline',
      type: 'textarea',
      localized: true,
    },
    // Example: Social Media Links
    {
      name: 'socialMediaLinks',
      label: 'Social Media Links',
      type: 'array',
      localized: false, // Typically social links are not localized per field, but the whole array could be if needed for different sets of links per locale
      fields: [
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
            // Add more platforms as needed
          ],
          required: true,
        },
        {
          name: 'url',
          label: 'URL',
          type: 'url', // Payload's url field type
          required: true,
        },
      ],
    },
    // Default SEO settings for the entire site
    {
      name: 'defaultSeo',
      label: 'Default SEO Settings',
      type: 'group',
      fields: getSeoFields(true).fields, // Get the fields from seoFields, assuming defaults are localized
      admin: {
        description: 'These are fallback SEO settings if a specific page does not define its own.',
      }
    },
    // Add other fields from Sanity's 'settings' singleton, e.g., contact email, address
  ],
};
