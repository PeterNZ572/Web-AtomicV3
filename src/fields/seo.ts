import type { Field } from 'payload'

export const seoField: Field = {
  name: 'seo',
  type: 'group',
  label: 'SEO',
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Meta Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Meta Description',
    },
    {
      name: 'openGraphImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Open Graph Image',
    },
    {
      name: 'canonicalUrl',
      type: 'text',
      label: 'Canonical URL',
    },
    {
      name: 'noIndex',
      type: 'checkbox',
      label: 'No Index',
      defaultValue: false,
    },
    {
      name: 'noFollow',
      type: 'checkbox',
      label: 'No Follow',
      defaultValue: false,
    },
    {
      name: 'schemaType',
      type: 'select',
      label: 'Schema Type',
      options: [
        { label: 'Web Page', value: 'WebPage' },
        { label: 'Article', value: 'Article' },
        { label: 'Blog Post', value: 'BlogPosting' },
        { label: 'Product', value: 'Product' },
        { label: 'Service', value: 'Service' },
        { label: 'FAQ Page', value: 'FAQPage' },
        { label: 'Contact Page', value: 'ContactPage' },
        { label: 'About Page', value: 'AboutPage' },
        { label: 'Organization', value: 'Organization' },
        { label: 'Local Business', value: 'LocalBusiness' },
      ],
    },
  ],
}
