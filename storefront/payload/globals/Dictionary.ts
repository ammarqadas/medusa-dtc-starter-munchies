import type { GlobalConfig } from 'payload/types';

export const Dictionary: GlobalConfig = {
  slug: 'dictionary',
  admin: {
    group: 'Configuration',
    description: 'Site-wide text strings, labels, and translations not tied to specific content.',
  },
  fields: [
    {
      name: 'entries',
      label: 'Dictionary Entries',
      type: 'array',
      localized: true, // The values are localized, keys are static
      admin: {
        description: 'Define key-value pairs for text snippets used throughout the site.',
      },
      fields: [
        {
          name: 'key',
          label: 'Key',
          type: 'text',
          required: true,
          admin: {
            description: 'Unique identifier for this string (e.g., "form.submitError", "cart.emptyMessage").',
          },
        },
        {
          name: 'value',
          label: 'Value',
          type: 'textarea', // Or 'text' if snippets are short
          required: true,
        },
      ],
      // Consider adding a validation to ensure keys are unique within the array if needed.
    },
    // Alternatively, instead of an array, could have a group of named text fields:
    // { name: 'submitButtonLabel', type: 'text', localized: true },
    // { name: 'errorMessageGeneric', type: 'text', localized: true },
  ],
};
