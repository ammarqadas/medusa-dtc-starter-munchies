import type { GlobalConfig } from 'payload/types';
// Assuming 'link' or 'cta' fields might be complex enough to be defined in '../fields'
// For simplicity here, we'll define simple link structures directly.
// import { getCtaFields } from '../fields/cta';

export const Header: GlobalConfig = {
  slug: 'header',
  admin: {
    group: 'Navigation',
    description: 'Site header configuration, navigation links, announcement bar.',
  },
  fields: [
    {
      name: 'logo',
      label: 'Site Logo',
      type: 'upload',
      relationTo: 'media', // Assuming a 'media' collection for images
      // Add further configuration like required, localized if logo varies by language
    },
    {
      name: 'navigation',
      label: 'Main Navigation',
      type: 'array',
      localized: true, // Navigation often varies by locale
      fields: [
        // Simple link example:
        {
          name: 'label',
          label: 'Label',
          type: 'text',
          required: true,
        },
        {
          name: 'url', // Could be an internal path or external URL
          label: 'URL / Path',
          type: 'text',
          required: true,
          admin: { description: 'E.g., /about or https://example.com' }
        },
        // Or use a more complex link object if defined (e.g., from ctaFields or a dedicated linkField)
        // Example if using something like cta (label + link object):
        // ...getCtaFields().fields, // Spread fields if ctaFields is a group
        // {
        //   name: 'subNavigation', // Example for dropdowns
        //   label: 'Sub Navigation',
        //   type: 'array',
        //   fields: [
        //     { name: 'label', type: 'text', required: true },
        //     { name: 'url', type: 'text', required: true },
        //   ]
        // }
      ],
    },
    {
      name: 'announcementBar',
      label: 'Announcement Bar',
      type: 'group',
      localized: true,
      fields: [
        {
          name: 'show',
          label: 'Show Announcement Bar',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'message',
          label: 'Message',
          type: 'richText', // Or 'text' for simple messages
          admin: {
            condition: (_, siblingData) => siblingData.show,
          }
        },
        // {
        //   name: 'ctaLink', // Optional CTA for announcement
        //   label: 'CTA Link URL',
        //   type: 'text',
        //   admin: {
        //     condition: (_, siblingData) => siblingData.show,
        //   }
        // },
        // {
        //   name: 'ctaLabel',
        //   label: 'CTA Label',
        //   type: 'text',
        //   admin: {
        //     condition: (_, siblingData) => siblingData.show,
        //   }
        // }
      ]
    }
    // Add other fields from Sanity's 'header' singleton
  ],
};
