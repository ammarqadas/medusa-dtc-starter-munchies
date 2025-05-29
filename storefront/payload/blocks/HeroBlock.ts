import type { Block } from 'payload/types';
import { getCtaFields } from '../fields/cta'; // Assuming cta.ts is in ../fields/
import { getVideoFields } from '../fields/video'; // Assuming video.ts is in ../fields/

export const HeroBlock: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero Section',
    plural: 'Hero Sections',
  },
  fields: [
    {
      name: 'mediaType',
      label: 'Media Type',
      type: 'select',
      required: true,
      defaultValue: 'image',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Large Image', value: 'largeImage' },
        { label: 'Video', value: 'video' },
      ],
    },
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      label: 'Subtitle',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData.mediaType === 'image',
      },
    },
    getCtaFields({ required: true }), // Embed CTA fields, mark group as required
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        condition: (_, siblingData) => siblingData.mediaType === 'image',
      },
    },
    {
      name: 'largeImage',
      label: 'Large Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        condition: (_, siblingData) => siblingData.mediaType === 'largeImage',
      },
    },
    {
      ...getVideoFields(), // Embed Video fields (url, posterImage)
      name: 'videoContent', // Ensure the group has a unique name in this block
      label: 'Video Content',
      admin: {
        condition: (_, siblingData) => siblingData.mediaType === 'video',
      },
      // Making the video group itself required if mediaType is video
      // The internal 'url' field in videoFields is already required.
      validate: (value, { siblingData }) => {
        if (siblingData.mediaType === 'video') {
          if (!value || !value.url) {
            return 'Video URL is required when media type is Video.';
          }
        }
        return true;
      }
    },
  ],
};
