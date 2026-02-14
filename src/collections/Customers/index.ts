import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { authenticated } from '@/access/authenticated'
import { anyone } from '@/access/anyone'

export const Customers: CollectionConfig = {
  slug: 'customers',
  access: {
    create: anyone,
    delete: adminOnly,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'phone', 'createdAt'],
    group: 'Store',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'addresses',
      type: 'array',
      label: 'Addresses',
      fields: [
        {
          name: 'type',
          type: 'select',
          options: [
            { label: 'Shipping', value: 'shipping' },
            { label: 'Billing', value: 'billing' },
          ],
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          label: 'Address Name',
          required: true,
        },
        {
          name: 'street',
          type: 'text',
          label: 'Street Address',
          required: true,
        },
        {
          name: 'street2',
          type: 'text',
          label: 'Apartment, suite, etc.',
        },
        {
          name: 'city',
          type: 'text',
          label: 'City',
          required: true,
        },
        {
          name: 'state',
          type: 'text',
          label: 'State/Province',
          required: true,
        },
        {
          name: 'zip',
          type: 'text',
          label: 'ZIP/Postal Code',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          label: 'Country',
          defaultValue: 'US',
          required: true,
        },
        {
          name: 'isDefault',
          type: 'checkbox',
          defaultValue: false,
          label: 'Default Address',
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Internal Notes',
      admin: {
        description: 'Private notes about this customer',
      },
    },
  ],
  timestamps: true,
}
