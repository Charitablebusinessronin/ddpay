import type { CollectionConfig } from 'payload'

import { adminOnly } from '../../access/adminOnly'
import { authenticated } from '../../access/authenticated'

export const Merchants: CollectionConfig = {
  slug: 'merchants',
  admin: {
    useAsTitle: 'businessName',
    defaultColumns: ['businessName', 'email', 'status', 'createdAt'],
  },
  access: {
    create: adminOnly,
    read: authenticated,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    // Basic Information
    {
      name: 'businessName',
      type: 'text',
      required: true,
      label: 'Business Name',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
      label: 'Business Email',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      label: 'Contact Phone',
    },
    // Address Information
    {
      name: 'address',
      type: 'group',
      fields: [
        {
          name: 'street',
          type: 'text',
          required: true,
        },
        {
          name: 'city',
          type: 'text',
          required: true,
        },
        {
          name: 'state',
          type: 'text',
          required: true,
        },
        {
          name: 'zipCode',
          type: 'text',
          required: true,
        },
        {
          name: 'country',
          type: 'text',
          required: true,
          defaultValue: 'US',
        },
      ],
    },
    // Business Details
    {
      name: 'taxId',
      type: 'text',
      required: true,
      unique: true,
      label: 'Tax ID / EIN',
    },
    {
      name: 'businessType',
      type: 'select',
      required: true,
      options: [
        { label: 'Sole Proprietorship', value: 'sole_proprietorship' },
        { label: 'Partnership', value: 'partnership' },
        { label: 'LLC', value: 'llc' },
        { label: 'Corporation', value: 'corporation' },
        { label: 'Non-Profit', value: 'non_profit' },
      ],
    },
    // Bank Account Information (for payouts)
    {
      name: 'bankAccount',
      type: 'group',
      label: 'Bank Account Details',
      fields: [
        {
          name: 'accountHolderName',
          type: 'text',
          required: true,
        },
        {
          name: 'accountNumber',
          type: 'text',
          required: true,
          // In production, consider encryption or tokenization
        },
        {
          name: 'routingNumber',
          type: 'text',
          required: true,
        },
        {
          name: 'bankName',
          type: 'text',
          required: true,
        },
        {
          name: 'accountType',
          type: 'select',
          required: true,
          options: [
            { label: 'Checking', value: 'checking' },
            { label: 'Savings', value: 'savings' },
          ],
        },
      ],
    },
    // Status
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Active', value: 'active' },
        { label: 'Suspended', value: 'suspended' },
        { label: 'Inactive', value: 'inactive' },
      ],
      access: {
        read: () => true,
        create: adminOnly,
        update: adminOnly,
      },
    },
    // Verification Documents
    {
      name: 'verificationDocuments',
      type: 'array',
      label: 'Verification Documents',
      fields: [
        {
          name: 'documentType',
          type: 'select',
          required: true,
          options: [
            { label: 'Business License', value: 'business_license' },
            { label: 'Tax Document (W-9)', value: 'tax_document' },
            { label: 'Bank Statement', value: 'bank_statement' },
            { label: 'ID Document', value: 'id_document' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'document',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'uploadedAt',
          type: 'date',
          admin: {
            readOnly: true,
          },
          hooks: {
            beforeChange: [() => new Date().toISOString()],
          },
        },
      ],
    },
    // Related User Account
    {
      name: 'userAccount',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Linked user account with merchant role',
      },
    },
    // Metadata
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this merchant',
      },
    },
  ],
  timestamps: true,
}
