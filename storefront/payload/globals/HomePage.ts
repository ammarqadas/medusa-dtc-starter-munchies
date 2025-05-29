import type { GlobalConfig } from 'payload/types';
import { getSeoFields } from '../fields/seo';
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

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  admin: {
    group: 'Content',
    description: 'Content for the homepage.',
  },
  fields: [
    {
      name: 'title', // Internal title for this global, or used as H1 if no hero
      label: 'Homepage Title / Identifier',
      type: 'text',
      defaultValue: 'Homepage Content',
      required: true,
      localized: true,
    },
    {
      name: 'layout',
      label: 'Homepage Content Blocks',
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
  ],
};
