import type { GlobalConfig } from 'payload/types';

export const CookieBanner: GlobalConfig = {
  slug: 'cookie-banner',
  admin: {
    group: 'Configuration',
    description: 'Settings for the cookie consent banner.',
  },
  fields: [
    {
      name: 'showBanner',
      label: 'Show Cookie Banner',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'message',
      label: 'Banner Message',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        condition: (_, siblingData) => siblingData.showBanner,
      },
    },
    {
      name: 'acceptButtonLabel',
      label: 'Accept Button Label',
      type: 'text',
      defaultValue: 'Accept',
      required: true,
      localized: true,
      admin: {
        condition: (_, siblingData) => siblingData.showBanner,
      },
    },
    {
      name: 'declineButtonLabel',
      label: 'Decline Button Label',
      type: 'text',
      defaultValue: 'Decline',
      localized: true, // Optional: some may not want a decline button
      admin: {
        condition: (_, siblingData) => siblingData.showBanner,
      },
    },
    {
      name: 'privacyPolicyLink',
      label: 'Privacy Policy Link (URL)',
      type: 'text', // URL or relationship to a 'privacy-policy' page
      localized: true,
       admin: {
        condition: (_, siblingData) => siblingData.showBanner,
        description: "Link to your privacy policy page. E.g., /privacy-policy"
      },
    }
  ],
};
