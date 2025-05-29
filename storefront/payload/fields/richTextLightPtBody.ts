// storefront/payload/fields/richTextLightPtBody.ts
import type { RichTextField } from 'payload/types';
import type { Editor } from 'slate'; // Import the Editor type if needed for deep customization

// Define the features for the light editor based on Sanity's lightPtBody
const lightFeatures: Array<string | { newFeature: any }> = [ // Adjust based on actual Slate feature names/plugins
  'bold',
  'italic',
  'underline',
  'strikethrough',
  // No lists, no links, no blockquotes, no custom blocks
];

export const richTextLightPtBody: Omit<RichTextField, 'name'> = {
  label: 'Light Rich Text',
  type: 'richText',
  editor: {
    // This part depends on how you configure Slate features in payload.config.ts or via plugins
    // For Payload 3.0 (beta/next) and later, features are often imported and spread.
    // For older versions, it might be an array of strings.
    // Assuming a simplified features array for now.
    // This will need to be aligned with how `slateEditor` is configured in `payload.config.ts`
    // For now, we'll define it conceptually. The actual enabling/disabling happens in payload.config
    admin: {
      description: 'A restricted rich text editor for simple text formatting.',
      elements: [
        // No block elements like h1-h6, blockquote, list by default if not specified
      ],
      leaves: ['bold', 'italic', 'underline', 'strikethrough']
    }
  }
};

// Helper to use it:
// {
//   name: 'myLightContent',
//   ...richTextLightPtBody,
//   localized: true,
// }
