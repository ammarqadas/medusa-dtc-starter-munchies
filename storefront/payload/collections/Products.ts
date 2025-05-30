import type { CollectionConfig } from 'payload/types';
import { getSeoFields } from '../fields/seo';
import { slugField } from '../fields/slug';
import { HeroBlock } from '../blocks/HeroBlock'; // Example block
import { MediaTextBlock } from '../blocks/MediaTextBlock'; // Example block
import { AssuranceBlock } from '../blocks/AssuranceBlock';
import { CenteredTextBlock } from '../blocks/CenteredTextBlock';
import { CollectionListBlock } from '../blocks/CollectionListBlock';
import { FeaturedProductsBlock } from '../blocks/FeaturedProductsBlock';
import { MarqueeBlock } from '../blocks/MarqueeBlock';
import { ShopTheLookBlock } from '../blocks/ShopTheLookBlock';
import { TestimonialsSectionBlock } from '../blocks/TestimonialsSectionBlock';
// Import other blocks that will be part of the 'layout' field

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'Product information and content pages.',
    // livePreview: { // Example: if you set up live preview
    //   url: ({ data, locale }) =>
    //     data.slug && typeof data.slug === 'string'
    //       ? `http://localhost:3000/products/${data.slug}${locale ? '?locale=' + locale : ''}`
    //       : 'http://localhost:3000',
    //   collections: ['products'],
    // },
  },
  // access: { read: () => true }, // Define access controls
  fields: [
    {
      name: 'title', // Corresponds to Sanity's 'title' or 'internalTitle'
      label: 'Product Title',
      type: 'text',
      required: true,
      localized: true,
    },
    // slugField({sourceField: 'title', localized: true}), // Reusable slug field

    // Specs from Sanity product schema
    {
      name: 'specifications', // Was 'specs' in Sanity
      label: 'Specifications',
      type: 'array',
      minRows: 0,
      localized: true, // Assuming specs can be localized
      fields: [
        {
          name: 'title',
          label: 'Specification Title',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          label: 'Specification Content',
          type: 'textarea',
          required: true,
        }
      ],
      admin: {
        components: {
          RowLabel: ({ data, index }) => {
            // Fallback to index if title is not available (e.g. for a new unsaved row)
            return data?.title || `Spec ${index != null ? String(index + 1).padStart(2, '0') : ''}`;
          },
        },
      }
    },

    // Addons from Sanity product schema
    {
      name: 'addons',
      label: 'Product Addons / Related Products',
      type: 'group',
      localized: true, // Localize the group if title or product list can vary by locale
      fields: [
        {
          name: 'title',
          label: 'Section Title',
          type: 'text',
          defaultValue: 'You might also like',
        },
        {
          name: 'relatedProducts', // Was 'products' in Sanity
          label: 'Select Products',
          type: 'relationship',
          relationTo: 'products',
          hasMany: true,
          // Sanity had validation: Rule.max(3). Payload relationship fields don't have maxCount directly.
          // This can be enforced with a validate function.
          validate: async (value) => {
            if (value && Array.isArray(value) && value.length > 3) {
              return 'You can select a maximum of 3 related products.';
            }
            return true;
          }
        }
      ]
    },

    // Sections from Sanity product schema (was 'sectionsBody' type)
    {
      name: 'layout', // Or 'pageLayout', 'contentBlocks', etc.
      label: 'Page Content Blocks',
      type: 'blocks',
      minRows: 0,
      localized: true, // Assuming page layout can be localized
      blocks: [
        HeroBlock,
        MediaTextBlock,
        AssuranceBlock,
        CenteredTextBlock,
        CollectionListBlock,
        FeaturedProductsBlock,
        MarqueeBlock,
        ShopTheLookBlock,
        TestimonialsSectionBlock,
        // Add other imported block types here:
      ],
    },
    
    getSeoFields(true), // Assuming SEO is localized
    
    {
      name: 'indexable',
      label: 'Indexable by Search Engines',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      }
    },
    slugField({sourceField: 'title', localized: true}),
  ],
  // versions: { drafts: true }, // Enable versioning and drafts if needed
};
