import type { Block } from 'payload/types';

export const MediaTextBlock: Block = {
  slug: 'mediaText',
  labels: {
    singular: 'Media + Text Section',
    plural: 'Media + Text Sections',
  },
  fields: [
    {
      name: 'imagePosition',
      label: 'Image Position',
      type: 'select',
      required: true,
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
      admin: {
        width: '50%',
      }
    },
    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
    },
  ],
};
