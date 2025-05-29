import type { Block } from 'payload/types';
import { getCtaFields } from '../fields/cta';

export const CollectionListBlock: Block = {
  slug: 'collectionList',
  labels: {
    singular: 'Collection List Section',
    plural: 'Collection List Sections',
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'collections', // Was 'cards' in Sanity, 'collections' is more descriptive
      label: 'Collections',
      type: 'array',
      minRows: 1, // Sanity had min(3).max(3) for cards, adjust as needed
      // maxRows: 3, 
      required: true,
      localized: true, // If the choice of collections or their presentation varies by locale
      fields: [
        {
          name: 'collection',
          label: 'Collection',
          type: 'relationship',
          relationTo: 'product-collections', // Use the slug for ProductCollections
          required: true,
        },
        // The Sanity 'collectionCard' had an 'image' and 'cta' field.
        // The 'image' for a collection could be a field on the 'ProductCollections' collection itself.
        // The 'cta' for a collection card could also be derived from the collection or added explicitly here.
        // If explicit CTA per card is needed:
        // getCtaFields({required: true}), // If CTA is required for each collection card
        // If image override per card is needed:
        // {
        //   name: 'customImage',
        //   label: 'Custom Image (Overrides Collection Image)',
        //   type: 'upload',
        //   relationTo: 'media',
        // }
      ],
      admin: {
        components: {
          RowLabel: ({ data, index, req }) => {
            // Attempt to fetch and display the related collection's title
            // This is a simplified example. Production code might need more robust error handling
            // and potentially a dedicated async function to fetch related titles.
            if (data?.collection) {
              // This is pseudo-code for the concept; direct async calls in RowLabel are complex.
              // In a real scenario, you might store the title alongside the ID or have a custom component.
              // For now, we'll just show the ID or a placeholder.
              return `Collection ID: ${data.collection}`;
            }
            return `Collection ${String(index + 1).padStart(2, '0')}`;
          },
        },
      }
    },
  ],
};
