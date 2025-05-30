import type { Block } from 'payload/types';
import { getSpotFields } from '../fields/spot'; // Assuming spot.ts is in ../fields/

export const ShopTheLookBlock: Block = {
  slug: 'shopTheLook',
  labels: {
    singular: 'Shop The Look Section',
    plural: 'Shop The Look Sections',
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
      name: 'mainImage', // Was 'image' in Sanity
      label: 'Main Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      // Note: Sanity's imageHotspot.imagePath pointed to this field.
      // Payload doesn't have a direct equivalent for configuring hotspot image source
      // directly in the field that *uses* hotspots. The `spotFields` themselves
      // (or the UI component rendering them) would need to know which image to reference.
    },
    {
      name: 'productHotspots',
      label: 'Product Hotspots',
      type: 'array', // Using an array of groups, each group being a spot
      // Sanity had 'options: { imageHotspot: { imagePath: "image", pathRoot: "parent" } }'
      // This implies that the hotspot coordinates are relative to 'mainImage'.
      // The `spotFields` group already contains X and Y coordinates.
      // The visual editor for placing hotspots will need to be custom or a plugin.
      fields: [
        getSpotFields() // This will embed product relationship, positionX, positionY
      ],
      minRows: 0,
      admin: {
        description: 'Add hotspots to the main image, linking to products.',
        components: {
          RowLabel: ({ data, index, req }) => {
            // Similar to CollectionListBlock, fetching related product title would be ideal
            // but complex for a simple RowLabel.
            if (data?.productHotspot?.product) {
              return `Hotspot for Product ID: ${data.productHotspot.product}`;
            }
            return `Hotspot ${String(index + 1).padStart(2, '0')}`;
          },
        },
      }
    },
  ],
};
