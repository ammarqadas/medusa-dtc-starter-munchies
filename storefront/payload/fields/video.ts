import type { GroupField } from 'payload/types';

// Define the Video group field
export const videoFields: GroupField = {
  name: 'videoEmbed', // Renamed from 'video' to avoid potential conflicts if used as a top-level field name
  label: 'Video Embed',
  type: 'group',
  fields: [
    {
      name: 'url',
      label: 'Video URL',
      type: 'text',
      required: true,
      admin: {
        description: 'URL of the video (e.g., YouTube, Vimeo).',
      },
      validate: (value) => {
        if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
          return 'Please enter a valid video URL.';
        }
        return true;
      }
    },
    {
      name: 'posterImage', // Renamed from 'poster' for clarity
      label: 'Poster Image (Thumbnail)',
      type: 'upload',
      relationTo: 'media', // Assumes a 'media' collection slug
      admin: {
        description: 'Optional. An image to display before the video plays.',
      }
    }
  ]
};

// Helper function
export const getVideoFields = (options?: { localized?: boolean }): GroupField => {
  let fieldConfig = { ...videoFields };
  if (options?.localized) {
    fieldConfig = {
      ...fieldConfig,
      localized: true,
      fields: fieldConfig.fields.map(field => ({ ...field, localized: true }))
    };
  }
  return fieldConfig;
};
