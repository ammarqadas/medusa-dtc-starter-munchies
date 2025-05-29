import type { GroupField } from 'payload/types';

// Define the Spot group field (for product hotspots)
export const spotFields: GroupField = {
  name: 'productHotspot', // Renamed from 'spot' for clarity
  label: 'Product Hotspot',
  type: 'group',
  admin: {
    description: 'Defines a hotspot linking to a product, typically used on an image.',
  },
  fields: [
    {
      name: 'product',
      label: 'Product',
      type: 'relationship',
      relationTo: 'products', // Assumes a 'products' collection slug
      required: true,
      // Sanity 'spot' had 'weak: true'. Payload doesn't have a direct 'weak' reference concept.
      // If the referenced product is deleted, the relationship field will hold the ID but data won't resolve.
      // Frontend queries need to handle cases where product data might not be available.
    },
    {
      name: 'positionX', // Renamed from 'x'
      label: 'Position X (%)',
      type: 'number',
      required: true,
      admin: {
        description: 'Percentage from the left edge (0-100).',
        readOnly: true, // As per Sanity schema
        width: '50%',
      },
      min: 0,
      max: 100,
    },
    {
      name: 'positionY', // Renamed from 'y'
      label: 'Position Y (%)',
      type: 'number',
      required: true,
      admin: {
        description: 'Percentage from the top edge (0-100).',
        readOnly: true, // As per Sanity schema
        width: '50%',
      },
      min: 0,
      max: 100,
    }
  ]
};

// Helper function
export const getSpotFields = (options?: { localized?: boolean }): GroupField => {
  let fieldConfig = { ...spotFields };
  if (options?.localized) {
    fieldConfig = {
      ...fieldConfig,
      localized: true,
      fields: fieldConfig.fields.map(field => ({ ...field, localized: true }))
    };
  }
  return fieldConfig;
};
