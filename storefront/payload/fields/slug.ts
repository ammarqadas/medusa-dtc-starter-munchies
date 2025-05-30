import type { Field } from 'payload/types';
import { formatSlug } from '../utils/formatSlug'; // A utility function to create slugs

interface SlugFieldOptions {
  sourceField?: string; // Field to generate slug from, defaults to 'title'
  localized?: boolean;
}

export const slugField = (options: SlugFieldOptions = {}): Field => {
  const { sourceField = 'title', localized = false } = options;

  return {
    name: 'slug',
    label: 'Slug',
    type: 'text',
    index: true, // Add a database index for faster queries
    unique: true, // Ensure slugs are unique across documents (if not localized per language)
    localized: localized,
    admin: {
      position: 'sidebar',
      description: `A unique identifier for the URL. Generated from '${sourceField}'.`,
    },
    hooks: {
      beforeValidate: [
        async ({ value, originalDoc, data, operation, req }) => {
          // If creating or updating, and source field has changed or slug is empty
          const currentSourceField = data?.[sourceField] || originalDoc?.[sourceField];
          
          if (operation === 'create' || (operation === 'update' && (data?.[sourceField] || !value))) {
            if (currentSourceField && typeof currentSourceField === 'string') {
               if (localized && req.locale) {
                // If localized, format slug for the current locale if source field for that locale is present
                const sourceValueForLocale = data?.[sourceField]?.[req.locale] || (operation === 'create' ? currentSourceField : null);
                if (sourceValueForLocale) return formatSlug(sourceValueForLocale);
                // If source for current locale is empty but slug exists, keep it (might be set manually)
                if (value) return value; 
                // If source for current locale is empty and no slug, try default locale if available
                if (req.fallbackLocale && data?.[sourceField]?.[req.fallbackLocale]) {
                  return formatSlug(data?.[sourceField]?.[req.fallbackLocale]);
                }
                 // If still nothing, and it's a new doc, slugify the non-localized source if that's all we have
                if (operation === 'create' && !localized) return formatSlug(currentSourceField);


              } else if (!localized) {
                 // Not localized, or current data for source field is a simple string
                return formatSlug(currentSourceField);
              }
            }
          }
          // If slug is manually changed, format it as well
          if (typeof value === 'string' && value !== originalDoc?.slug) {
            return formatSlug(value);
          }
          return value;
        },
      ],
    },
    validate: async (value, { operation, originalDoc, req, t }) => {
      if (!value) {
        return t('validation:required'); // Payload's built-in required message
      }
      // Add more validation if needed, e.g., regex for valid slug characters
      if (typeof value === 'string' && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
        return "Slug can only contain lowercase letters, numbers, and hyphens, and cannot start or end with a hyphen.";
      }
      
      // Check for uniqueness if not localized or if locale-specific uniqueness is desired
      // This example assumes global uniqueness for non-localized slugs,
      // or uniqueness per locale if slugs are localized.
      if (value) {
        const query: any = { slug: { equals: value } };
        if (originalDoc && operation === 'update') {
          query.id = { not_equals: originalDoc.id };
        }
        if (localized && req?.locale) {
           // This is tricky with Payload's default query language for localized fields.
           // A direct query for `slug.${req.locale}` might be needed or a custom endpoint.
           // For simplicity, this check might need adjustment for localized unique slugs.
           // A common pattern is to make slugs globally unique or use a hook that queries specifically for that locale.
        }

        try {
          const { docs } = await req.payload.find({
            collection: req.collection.config.slug,
            where: query,
            limit: 1,
            depth: 0,
            locale: localized && req?.locale ? req.locale : 'all', // query all locales if checking global uniqueness or specific if localized
            overrideAccess: true, 
          });

          if (docs.length > 0) {
            // If localized, check if the found doc's slug for the current locale matches
            if (localized && req?.locale) {
                const foundSlugInLocale = docs[0].slug?.[req.locale];
                if (foundSlugInLocale === value) {
                    return t('validation:unique', { label: t('fields:slug.label') });
                }
            } else if (!localized) { // Not localized, any match is a conflict
                return t('validation:unique', { label: t('fields:slug.label') });
            }
          }
        } catch (err) {
          console.error("Error checking slug uniqueness:", err);
          // Potentially return an error message or allow save if uniqueness check fails
        }
      }
      return true;
    },
  };
};
