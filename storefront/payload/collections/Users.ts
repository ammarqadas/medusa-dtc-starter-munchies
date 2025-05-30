import type { CollectionConfig } from 'payload/types';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true, // Enable Payload authentication
  admin: {
    useAsTitle: 'email', // Display email in admin UI lists
    description: 'User accounts for CMS access.',
  },
  access: {
    // Define access controls as needed
    // Example: Allow only admins to create new users
    // create: ({ req }) => req.user?.role === 'admin',
    // read: () => true,
    // update: ({ req }) => req.user?.role === 'admin' || req.user?.id === req.id,
    // delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'firstName',
      label: 'First Name',
      type: 'text',
    },
    {
      name: 'lastName',
      label: 'Last Name',
      type: 'text',
    },
    // Email and password fields are automatically added by `auth: true`
    // Add more fields here if needed, like 'roles'
    // {
    //   name: 'roles',
    //   label: 'Roles',
    //   type: 'select',
    //   hasMany: true,
    //   options: [
    //     { label: 'Admin', value: 'admin' },
    //     { label: 'Editor', value: 'editor' },
    //   ],
    //   defaultValue: ['editor'],
    // }
  ],
};
