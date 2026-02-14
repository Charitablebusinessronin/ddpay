import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'

export const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    create: anyone,
    delete: adminOnly,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customer', 'status', 'total', 'createdAt'],
    group: 'Store',
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      required: true,
      unique: true,
      label: 'Order Number',
      admin: {
        description: 'Auto-generated on creation',
      },
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers' as any,
      required: true,
      label: 'Customer',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Refunded', value: 'refunded' },
      ],
      defaultValue: 'pending',
      required: true,
      label: 'Order Status',
    },
    {
      name: 'paymentStatus',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Authorized', value: 'authorized' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
        { label: 'Refunded', value: 'refunded' },
      ],
      defaultValue: 'pending',
      required: true,
      label: 'Payment Status',
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      label: 'Order Items',
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products' as any,
          required: true,
          label: 'Product',
        },
        {
          name: 'variant',
          type: 'text',
          label: 'Variant',
          admin: {
            description: 'Product variant details',
          },
        },
        {
          name: 'sku',
          type: 'text',
          required: true,
          label: 'SKU',
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Item Title',
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          defaultValue: 1,
          label: 'Quantity',
        },
        {
          name: 'unitPrice',
          type: 'number',
          required: true,
          label: 'Unit Price',
        },
        {
          name: 'totalPrice',
          type: 'number',
          required: true,
          label: 'Total Price',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Product Image',
        },
      ],
    },
    {
      name: 'shippingAddress',
      type: 'group',
      required: true,
      label: 'Shipping Address',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Recipient Name',
        },
        {
          name: 'street',
          type: 'text',
          required: true,
          label: 'Street Address',
        },
        {
          name: 'street2',
          type: 'text',
          label: 'Apartment, suite, etc.',
        },
        {
          name: 'city',
          type: 'text',
          required: true,
          label: 'City',
        },
        {
          name: 'state',
          type: 'text',
          required: true,
          label: 'State/Province',
        },
        {
          name: 'zip',
          type: 'text',
          required: true,
          label: 'ZIP/Postal Code',
        },
        {
          name: 'country',
          type: 'text',
          required: true,
          label: 'Country',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Contact Phone',
        },
      ],
    },
    {
      name: 'billingAddress',
      type: 'group',
      required: true,
      label: 'Billing Address',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Billing Name',
        },
        {
          name: 'street',
          type: 'text',
          required: true,
          label: 'Street Address',
        },
        {
          name: 'street2',
          type: 'text',
          label: 'Apartment, suite, etc.',
        },
        {
          name: 'city',
          type: 'text',
          required: true,
          label: 'City',
        },
        {
          name: 'state',
          type: 'text',
          required: true,
          label: 'State/Province',
        },
        {
          name: 'zip',
          type: 'text',
          required: true,
          label: 'ZIP/Postal Code',
        },
        {
          name: 'country',
          type: 'text',
          required: true,
          label: 'Country',
        },
      ],
    },
    {
      name: 'subtotal',
      type: 'number',
      required: true,
      label: 'Subtotal',
    },
    {
      name: 'shipping',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Shipping Cost',
    },
    {
      name: 'tax',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: 'Tax',
    },
    {
      name: 'discount',
      type: 'number',
      defaultValue: 0,
      label: 'Discount',
    },
    {
      name: 'total',
      type: 'number',
      required: true,
      label: 'Total',
    },
    {
      name: 'currency',
      type: 'text',
      defaultValue: 'USD',
      required: true,
      label: 'Currency',
    },
    {
      name: 'shippingMethod',
      type: 'text',
      label: 'Shipping Method',
    },
    {
      name: 'trackingNumber',
      type: 'text',
      label: 'Tracking Number',
    },
    {
      name: 'trackingUrl',
      type: 'text',
      label: 'Tracking URL',
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Order Notes',
      admin: {
        description: 'Internal notes about this order',
      },
    },
    {
      name: 'customerNotes',
      type: 'textarea',
      label: 'Customer Notes',
      admin: {
        description: 'Notes from the customer',
      },
    },
    {
      name: 'emails',
      type: 'array',
      label: 'Email History',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Order Confirmation', value: 'confirmation' },
            { label: 'Shipping Notification', value: 'shipping' },
            { label: 'Delivery Confirmation', value: 'delivery' },
            { label: 'Refund Notification', value: 'refund' },
          ],
          required: true,
        },
        {
          name: 'sentAt',
          type: 'date',
          required: true,
        },
        {
          name: 'subject',
          type: 'text',
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      async ({ data, operation }) => {
        if (operation === 'create' && data && !data.orderNumber) {
          // Generate order number: ORD-YYYYMMDD-XXXXX
          const now = new Date()
          const date = now.toISOString().slice(0, 10).replace(/-/g, '')
          const random = Math.floor(10000 + Math.random() * 90000)
          data.orderNumber = `ORD-${date}-${random}`
        }
        return data
      },
    ],
  },
  timestamps: true,
}
