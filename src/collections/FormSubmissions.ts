import type { CollectionConfig } from 'payload'

import { adminsOnly, editorsAndAdmins } from '../lib/access'

export const FormSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  labels: {
    singular: 'Form Submission',
    plural: 'Form Submissions',
  },
  access: {
    create: () => true,
    delete: adminsOnly,
    read: editorsAndAdmins,
    update: adminsOnly,
  },
  admin: {
    useAsTitle: 'formTitle',
    defaultColumns: ['formTitle', 'pageTitle', 'utmSource', 'utmMedium', 'createdAt'],
  },
  fields: [
    { name: 'formTitle', type: 'text', required: true },
    { name: 'pageTitle', type: 'text' },
    { name: 'pageSlug', type: 'text' },
    { name: 'recipientEmail', type: 'email' },
    {
      name: 'submissionData',
      type: 'json',
      required: true,
    },
    {
      type: 'collapsible',
      label: 'Attribution',
      admin: { initCollapsed: true },
      fields: [
        { name: 'utmSource', type: 'text', admin: { readOnly: true } },
        { name: 'utmMedium', type: 'text', admin: { readOnly: true } },
        { name: 'utmCampaign', type: 'text', admin: { readOnly: true } },
        { name: 'utmContent', type: 'text', admin: { readOnly: true } },
        { name: 'utmTerm', type: 'text', admin: { readOnly: true } },
        { name: 'referrer', type: 'text', admin: { readOnly: true } },
      ],
    },
  ],
}
