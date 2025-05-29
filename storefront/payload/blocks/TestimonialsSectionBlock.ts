import type { Block } from 'payload/types';

export const TestimonialsSectionBlock: Block = {
  slug: 'testimonialsSection', // Matches Sanity 'section.testimonials'
  labels: {
    singular: 'Testimonials Section',
    plural: 'Testimonials Sections',
  },
  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'selectedTestimonials', // Was 'testimonials' in Sanity
      label: 'Select Testimonials',
      type: 'relationship',
      relationTo: 'testimonials', // Assumes 'testimonials' collection slug
      hasMany: true,
      required: true,
      minRows: 1, // Sanity had min(4).max(10), adjust as needed
      // maxRows: 10,
      admin: {
        description: 'Select existing testimonials to display in this section.'
      }
    },
    // Option to add a "View All Testimonials" CTA
    // {
    //   name: 'viewAllCta',
    //   label: 'View All Testimonials CTA',
    //   type: 'group',
    //   fields: getCtaFields().fields
    // }
  ],
};
