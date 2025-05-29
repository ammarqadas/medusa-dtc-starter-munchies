import type { Block } from 'payload/types';

export const MarqueeBlock: Block = {
  slug: 'marquee',
  labels: {
    singular: 'Marquee Item',
    plural: 'Marquee Items',
  },
  fields: [
    {
      name: 'items',
      label: 'Marquee Items',
      type: 'array',
      minRows: 1,
      required: true,
      localized: true, // If text items are localized
      fields: [
        {
          name: 'text',
          label: 'Text',
          type: 'text',
          required: true,
        },
        // If images are also supported in marquee:
        // {
        //   name: 'image',
        //   label: 'Image',
        //   type: 'upload',
        //   relationTo: 'media'
        // },
        // {
        //   name: 'type',
        //   label: 'Item Type',
        //   type: 'radio',
        //   options: [ {label: 'Text', value: 'text'}, {label: 'Image', value: 'image'} ],
        //   defaultValue: 'text',
        //   admin: { layout: 'horizontal'}
        // }
      ],
      admin: {
        components: {
          RowLabel: ({ data, index }) => {
            return data?.text || `Item ${String(index + 1).padStart(2, '0')}`;
          },
        },
      }
    },
    {
        name: 'speed',
        label: 'Scroll Speed',
        type: 'select',
        defaultValue: 'normal',
        options: [
            {label: 'Slow', value: 'slow'},
            {label: 'Normal', value: 'normal'},
            {label: 'Fast', value: 'fast'},
        ]
    },
    {
        name: 'reverseDirection',
        label: 'Reverse Direction',
        type: 'checkbox',
        defaultValue: false,
    }
  ],
};
