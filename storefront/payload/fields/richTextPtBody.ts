// storefront/payload/fields/richTextPtBody.ts
import type { RichTextField } from 'payload/types';
// The actual custom element (like imageBlockPlugin) will be added to the editor in payload.config.ts

export const richTextPtBody: Omit<RichTextField, 'name'> = {
  label: 'Full Rich Text',
  type: 'richText',
  editor: {
    admin: {
      description: 'Full rich text editor with custom blocks like images.',
      elements: [ // Standard elements to enable
        'h2',
        'h3',
        'blockquote',
        'link', // Enable links
        'ul',
        'ol',
        // 'image-block' // The custom block type slug, will be added via config
      ],
      leaves: ['bold', 'italic', 'underline', 'strikethrough'] // Standard leaves
    }
  }
};
