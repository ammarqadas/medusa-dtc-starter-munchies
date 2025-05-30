// storefront/payload/components/richText/ImageBlock/plugin.ts
import type { RichTextCustomElement } from '@payloadcms/richtext-slate/dist/types'; // Payload 3

const withImage = (incomingEditor: any) => {
  const editor = incomingEditor;
  const { isVoid } = editor;

  editor.isVoid = (element: any) => (element.type === 'image-block' ? true : isVoid(element));

  return editor;
};

export const imageBlockPlugin = { // Conforms to Payload 3 plugin structure for elements
  name: 'image-block',
  Element: (props: any) => { // Basic Element renderer
    const { attributes, children, element } = props;
    // Fetch media data if element.fields.image.id exists
    // This is a simplified placeholder for rendering.
    // A real component would fetch and display the image and caption.
    return (
      <div {...attributes} contentEditable={false} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0' }}>
        {children}
        <p><strong>Image Block</strong></p>
        {element.fields?.image?.id && <p>Media ID: {element.fields.image.id}</p>}
        {element.fields?.caption && <p>Caption: {element.fields.caption}</p>}
        {!element.fields?.image?.id && <p>Select an image.</p>}
      </div>
    );
  },
  Button: () => { // Basic Button renderer
    // This would typically use useSlateStatic and editor.dispatch(..) to insert the element
    return <button type="button" onClick={() => console.log('Insert Image Block')}>Img</button>;
  },
  plugins: [withImage], // Include the Slate plugin
  // sourceFieldSlug: 'image', // if directly linking to an image upload - this is not a standard RichTextCustomElement property
  fields: [ // Fields for the modal/editor
    {
      name: 'image', // This will be nested under `fields` object in the element's data
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption', // This will be nested under `fields` object in the element's data
      label: 'Caption',
      type: 'text',
    }
  ]
} as RichTextCustomElement; // Type assertion for Payload 3
