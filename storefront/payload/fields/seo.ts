import type { Field } from 'payload/types';
import type { GroupField } from 'payload/types';

// Define the SEO group field
export const seoFields: GroupField = {
  name: 'seo',
  label: 'SEO Settings',
  type: 'group',
  admin: {
    description: 'Settings for search engine optimization and social sharing.',
    // Consider organizing these into a tab if the parent collection/global has many fields
  },
  fields: [
    {
      name: 'metaTitle',
      label: 'Meta Title',
      type: 'text',
      admin: {
        description: 'Recommended length: 15-70 characters.',
      },
      // Sanity had minLength: 15, maxLength: 70. Payload text fields don't have this built-in.
      // Validation can be added with the `validate` function if strict enforcement is needed.
      // validate: (value) => {
      //   if (value && (value.length < 15 || value.length > 70)) {
      //     return 'Meta Title must be between 15 and 70 characters.';
      //   }
      //   return true;
      // },
    },
    {
      name: 'metaDescription',
      label: 'Meta Description',
      type: 'textarea',
      admin: {
        description: 'Recommended length: 50-160 characters.',
      },
      // Sanity had minLength: 50, maxLength: 160.
      // validate: (value) => {
      //   if (value && (value.length < 50 || value.length > 160)) {
      //     return 'Meta Description must be between 50 and 160 characters.';
      //   }
      //   return true;
      // },
    },
    {
      name: 'metaImage',
      label: 'Social Sharing Image',
      type: 'upload',
      relationTo: 'media', // Assumes a 'media' collection slug
      admin: {
        description: 'Recommended size: 1200x630 pixels. Used for sharing on social media.',
      },
      // Note: Sanity's 'ogImage' had hotspot: true.
      // If hotspot data needs to be preserved, the 'media' collection will need custom fields for x, y, width, height.
    },
    {
      name: 'canonicalURL',
      label: 'Custom Canonical URL',
      type: 'text',
      admin: {
        description: 'Optional. Use this if this page content is duplicated elsewhere to point search engines to the original source.',
      },
      validate: (value) => {
        if (value && !value.startsWith('http://') && !value.startsWith('https://') && !value.startsWith('/')) {
          return 'Please enter a valid URL (starting with http://, https://, or / for internal paths).';
        }
        return true;
      }
    }
  ]
};

// Helper function to easily import and use the seo fields in collections/globals
// This also allows applying localization to the group if needed.
export const getSeoFields = (localized: boolean = false): GroupField => {
  if (localized) {
    return {
      ...seoFields,
      localized: true,
      fields: seoFields.fields.map(field => ({ ...field, localized: true })) // Ensure sub-fields are also localized
    };
  }
  return seoFields;
};
