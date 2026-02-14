import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'
import { adminOnly } from '@/access/adminOnly'
import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'

export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  access: {
    create: authenticated,
    delete: adminOnly,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'parent', 'sortOrder'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Category Name',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Category Description',
    },
    slugField({
      fieldToUse: 'title',
    }),
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'product-categories' as any,
      hasMany: false,
      label: 'Parent Category',
      admin: {
        description: 'Optional: Select a parent category to create a hierarchy',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      label: 'Sort Order',
      admin: {
        description: 'Categories are sorted by this number',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        description: 'Uncheck to hide this category from the storefront',
      },
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO Meta Data',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          label: 'Meta Title',
          admin: {
            description: 'Custom title for SEO (optional)',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
          admin: {
            description: 'Custom description for SEO (optional)',
          },
        },
        {
          name: 'metaImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Meta Image',
          admin: {
            description: 'Social sharing image',
          },
        },
      ],
    },
  ],
  timestamps: true,
}
