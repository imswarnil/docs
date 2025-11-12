// app.config.ts
export default defineAppConfig({
  ui: {
    colors: { primary: 'blue', neutral: 'slate' },
    footer: { slots: { root: 'border-t border-default', left: 'text-sm text-muted' } }
  },
  seo: {
    siteName: 'CRM Analytics Academy',
    siteUrl: 'https://crmanalytics.imswarnil.com',   // ← set your canonical base
    defaultLocale: 'en'
  },
  org: {
    type: 'EducationalOrganization',
    name: 'CRM Analytics Academy',
    legalName: 'CRM Analytics Academy',
    logo: '/logo.png',                                // public/logo.png
    sameAs: [
      'https://github.com/imswarnil/CRM-Analytics-Academy'
      // add LinkedIn/X/YouTube etc.
    ],
    areaServed: 'Worldwide'
  },
  service: {
    name: 'Salesforce CRM Analytics Training',
    serviceType: 'Online training',
    availableChannel: 'Online',
    termsPage: '/terms',
    contactPage: '/contact'
  },
  header: {
    title: '',
    to: '/',
    logo: { alt: '', light: '', dark: '' },
    search: true,
    colorMode: true,
    links: [{
      icon: 'i-simple-icons-github',
      to: 'https://github.com/imswarnil/CRM-Analytics-Academy',
      target: '_blank',
      'aria-label': 'GitHub'
    }]
  },
  footer: {
    credits: `Created By Swarnil • © ${new Date().getFullYear()}`,
    colorMode: false,
    links: [{
      icon: 'i-simple-icons-discord',
      to: 'https://go.nuxt.com/discord',
      target: '_blank',
      'aria-label': 'Nuxt on Discord'
    }, {
      icon: 'i-simple-icons-x',
      to: 'https://go.nuxt.com/x',
      target: '_blank',
      'aria-label': 'Nuxt on X'
    }, {
      icon: 'i-simple-icons-github',
      to: 'https://github.com/nuxt/ui',
      target: '_blank',
      'aria-label': 'Nuxt UI on GitHub'
    }]
  },
  toc: {
    title: 'Table of Contents',
    bottom: {
      title: 'Community',
      edit: '',
      links: [{
        icon: 'i-lucide-star',
        label: 'Star on GitHub',
        to: 'https://github.com/imswarnil/CRM-Analytics-Academy',
        target: '_blank'
      }, {
        icon: 'i-lucide-book-open',
        label: 'CRM Analytics Official Docs',
        to: 'https://developer.salesforce.com/developer-centers/crm-analytics',
        target: '_blank'
      }]
    }
  }
})
