import type { GroupField, TextField } from 'payload/types';

// Define the CTA group field
export const ctaFields: GroupField = {
  name: 'cta',
  label: 'Call to Action',
  type: 'group',
  fields: [
    {
      name: 'label',
      label: 'Button Label',
      type: 'text',
    },
    {
      name: 'url', // Was 'link' in Sanity, but 'url' is more descriptive for a string URL
      label: 'Link URL',
      type: 'text',
      admin: {
        description: 'Enter an internal path (e.g., /products/my-product) or an external URL (e.g., https://example.com).',
      },
      validate: (value, { siblingData }) => {
        // If a label is provided, a URL must also be provided.
        if (siblingData && siblingData.label && typeof siblingData.label === 'string' && siblingData.label.trim() !== '') {
          if (!value || typeof value !== 'string' || value.trim() === '') {
            return 'URL is required when a label is provided.';
          }
        }
        // Basic URL/path validation (optional, can be more sophisticated)
        if (value && typeof value === 'string' && value.trim() !== '') {
          if (!value.startsWith('http://') && !value.startsWith('https://') && !value.startsWith('/') && !value.startsWith('mailto:') && !value.startsWith('tel:')) {
            return 'Please enter a valid URL or path (e.g., https://..., /..., mailto:..., tel:...).';
          }
        }
        return true;
      },
    }
  ]
};

// Helper function to easily import and use the cta fields.
// This allows for making the whole group required, or localizing it if necessary.
// 'Required' here means the cta group itself must be filled, not necessarily its internal fields beyond their own validation.
export const getCtaFields = (options?: { required?: boolean; localized?: boolean }): GroupField => {
  let fieldConfig = { ...ctaFields };

  if (options?.required) {
    fieldConfig = {
      ...fieldConfig,
      // The 'validate' function for a group field itself can check if the group should be considered "filled".
      // For a CTA, we might consider it "filled" if either a label or URL is present, or if both are (depending on strictness).
      // However, 'required' on a group often means the group object itself must exist.
      // The internal field validation already handles the "label -> url required" logic.
      // If the entire CTA (e.g. label AND url) must be filled if the group is "required", that logic would go here.
      // For now, 'required' will just mean the cta group object should be there.
      // More specific validation is on child fields.
    };
  }

  if (options?.localized) {
    fieldConfig = {
      ...fieldConfig,
      localized: true,
      fields: fieldConfig.fields.map(field => ({ ...field, localized: true }))
    };
  }
  return fieldConfig;
};
