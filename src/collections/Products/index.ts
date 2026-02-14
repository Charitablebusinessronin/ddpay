import type { CollectionConfig, FieldHook } from 'payload'
import { slugField } from 'payload'
import { adminOnly } from '@/access/adminOnly'
import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'

const updateInventory: FieldHook = async ({ value, operation, originalDoc, req }) => {
  // Calculate total inventory across all variants
  if (operation === 'create' || operation === 'update') {
    return value
  }
  return value
}

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: adminOnly,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'sku', 'price', 'inventory', 'isActive', 'updatedAt'],
    group: 'Store',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Product Title',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Product Description',
      required: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Short Description',
      admin: {
        description: 'A brief summary for product listings (max 200 characters)',
      },
    },
    slugField({
      fieldToUse: 'title',
    }),
    {
      name: 'sku',
      type: 'text',
      required: true,
      unique: true,
      label: 'SKU',
      admin: {
        description: 'Unique product identifier (Stock Keeping Unit)',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'product-categories' as any,
      hasMany: true,
      label: 'Categories',
      admin: {
        description: 'Select one or more categories for this product',
      },
    },
    {
      name: 'images',
      type: 'array',
      label: 'Product Images',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          label: 'Alt Text',
          admin: {
            description: 'Alternative text for accessibility',
          },
        },
        {
          name: 'isPrimary',
          type: 'checkbox',
          defaultValue: false,
          label: 'Primary Image',
          admin: {
            description: 'Check to set as the main product image',
          },
        },
      ],
    },
    {
      name: 'pricing',
      type: 'group',
      label: 'Pricing',
      fields: [
        {
          name: 'price',
          type: 'number',
          required: true,
          label: 'Regular Price',
          admin: {
            description: 'Price in cents (e.g., 1999 for $19.99)',
          },
        },
        {
          name: 'compareAtPrice',
          type: 'number',
          label: 'Compare at Price',
          admin: {
            description: 'Original price for showing discounts (optional)',
          },
        },
        {
          name: 'costPerItem',
          type: 'number',
          label: 'Cost per Item',
          admin: {
            description: 'Internal cost (for profit calculations)',
          },
        },
        {
          name: 'taxable',
          type: 'checkbox',
          defaultValue: true,
          label: 'Taxable',
        },
      ],
    },
    {
      name: 'inventory',
      type: 'group',
      label: 'Inventory',
      fields: [
        {
          name: 'trackInventory',
          type: 'checkbox',
          defaultValue: true,
          label: 'Track Inventory',
        },
        {
          name: 'quantity',
          type: 'number',
          defaultValue: 0,
          label: 'Stock Quantity',
          admin: {
            condition: (data, siblingData) => siblingData.trackInventory,
          },
        },
        {
          name: 'lowStockThreshold',
          type: 'number',
          defaultValue: 10,
          label: 'Low Stock Alert Threshold',
          admin: {
            condition: (data, siblingData) => siblingData.trackInventory,
          },
        },
        {
          name: 'allowBackorders',
          type: 'checkbox',
          defaultValue: false,
          label: 'Allow Backorders',
        },
        {
          name: 'requiresShipping',
          type: 'checkbox',
          defaultValue: true,
          label: 'Requires Shipping',
        },
      ],
    },
    {
      name: 'variants',
      type: 'array',
      label: 'Product Variants',
      admin: {
        description: 'Different versions of the product (e.g., sizes, colors)',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Variant Title',
          admin: {
            description: 'e.g., "Large - Blue"',
          },
        },
        {
          name: 'sku',
          type: 'text',
          required: true,
          label: 'Variant SKU',
        },
        {
          name: 'price',
          type: 'number',
          label: 'Variant Price',
          admin: {
            description: 'Leave empty to use base product price',
          },
        },
        {
          name: 'quantity',
          type: 'number',
          defaultValue: 0,
          label: 'Stock Quantity',
        },
        {
          name: 'options',
          type: 'array',
          label: 'Options',
          fields: [
            {
              name: 'option',
              type: 'text',
              label: 'Option',
              admin: {
                description: 'e.g., Size, Color',
              },
            },
            {
              name: 'value',
              type: 'text',
              label: 'Value',
              admin: {
                description: 'e.g., Large, Blue',
              },
            },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Variant Image',
        },
      ],
    },
    {
      name: 'shipping',
      type: 'group',
      label: 'Shipping',
      fields: [
        {
          name: 'weight',
          type: 'number',
          label: 'Weight (kg)',
        },
        {
          name: 'dimensions',
          type: 'group',
          label: 'Dimensions',
          fields: [
            {
              name: 'length',
              type: 'number',
              label: 'Length (cm)',
            },
            {
              name: 'width',
              type: 'number',
              label: 'Width (cm)',
            },
            {
              name: 'height',
              type: 'number',
              label: 'Height (cm)',
            },
          ],
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active',
      admin: {
        description: 'Only active products are visible in the storefront',
      },
    },
    {
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Featured',
      admin: {
        description: 'Feature this product on the homepage',
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
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          label: 'Meta Description',
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'Keywords',
          admin: {
            description: 'Comma-separated keywords',
          },
        },
      ],
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products' as any,
      hasMany: true,
      label: 'Related Products',
    },
  ],
  timestamps: true,
}
