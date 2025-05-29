import type { CollectionConfig } from 'payload/types';
import { getSeoFields } from '../fields/seo';
import { slugField } from '../fields/slug';
import { HeroBlock } from '../blocks/HeroBlock';
import { MediaTextBlock } from '../blocks/MediaTextBlock';
import { AssuranceBlock } from '../blocks/AssuranceBlock';
import { CenteredTextBlock } from '../blocks/CenteredTextBlock';
import { CollectionListBlock } from '../blocks/CollectionListBlock';
import { FeaturedProductsBlock } from '../blocks/FeaturedProductsBlock';
import { MarqueeBlock } from '../blocks/MarqueeBlock';
import { ShopTheLookBlock } from '../blocks/ShopTheLookBlock';
import { TestimonialsSectionBlock } from '../blocks/TestimonialsSectionBlock';
// Import all other relevant blocks

export const Pages: CollectionConfig = {
  slug: 'pages', // For modular pages
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'General content pages built with modular blocks.',
  },
  fields: [
    {
      name: 'title',
      label: 'Page Title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'layout', // The 'sectionsBody' equivalent
      label: 'Page Content Blocks',
      type: 'blocks',
      minRows: 1,
      localized: true,
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
        // Add all other Sanity sections converted to Payload Blocks here
      ],
    },
    getSeoFields(true),
    {
      name: 'indexable',
      label: 'Indexable by Search Engines',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    slugField({ sourceField: 'title', localized: true }),
  ],
  // versions: { drafts: true },
};
