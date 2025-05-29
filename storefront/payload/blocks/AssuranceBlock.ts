import type { Block } from 'payload/types';

export const AssuranceBlock: Block = {
  slug: 'assurance',
  labels: {
    singular: 'Assurance Section',
    plural: 'Assurance Sections',
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      localized: true,
    },
    {
      name: 'cards',
      label: 'Assurance Cards',
      type: 'array',
      minRows: 3,
      maxRows: 3,
      required: true,
      localized: true, // If card content needs localization
      fields: [
        {
          name: 'title',
          label: 'Card Title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          label: 'Card Description',
          type: 'textarea',
          required: true,
        },
        // Consider adding an 'icon' field here if icons are part of the design
        // {
        //   name: 'icon',
        //   label: 'Icon',
        //   type: 'select', // Or 'upload' if custom icons
        //   options: [ /* ... icon options ... */ ]
        // }
      ],
      admin: {
        components: {
          RowLabel: ({ data, index }) => {
            return data?.title || `Card ${String(index + 1).padStart(2, '0')}`;
          },
        },
      }
    },
  ],
};
