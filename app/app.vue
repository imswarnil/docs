<!-- app.vue -->
<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt'

const cfg = useAppConfig()
const { seo } = cfg

// Existing data you already fetch:
const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), { server: false })

// Optional: pull courses for JSON-LD (only if you add content/courses/*.md)
const { data: courseDocs } = await useAsyncData('courses-jsonld', async () => {
  try {
    // Use queryContent if available; if you only have queryCollection, adapt it.
    // @nuxt/content
    // @ts-ignore
    const q = await queryContent('/courses').only([
      'title','description','image','slug','duration','lang','price','currency','level','published'
    ]).find()
    return (q || []).filter((c: any) => c.published !== false)
  } catch {
    return []
  }
})

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: { lang: seo?.defaultLocale || 'en' },
  script: [{
    id: 'adsbygoogle-js',
    async: true,
    src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1291242080282540',
    crossorigin: 'anonymous'
  }]
})

useSeoMeta({
  titleTemplate: `%s - ${seo?.siteName}`,
  ogSiteName: seo?.siteName,
  twitterCard: 'summary_large_image'
})

const reqUrl = useRequestURL()
const origin = seo?.siteUrl || reqUrl.origin
const orgId = `${origin}#organization`
const siteId = `${origin}#website`
const serviceId = `${origin}#training-service`

// Build Course nodes (if you keep a catalog)
const courseNodes = (courseDocs.value || []).map((c: any) => {
  const url = `${origin}/courses/${c.slug || ''}`
  const offer = (typeof c.price === 'number' && c.price > 0) ? {
    '@type': 'Offer',
    price: c.price,
    priceCurrency: c.currency || 'INR',
    url,
    availability: 'https://schema.org/InStock'
  } : undefined

  return {
    '@type': 'Course',
    '@id': `${url}#course`,
    name: c.title,
    description: c.description,
    url,
    image: c.image ? `${origin}${c.image}` : undefined,
    provider: { '@id': orgId },
    educationalLevel: c.level || undefined,
    inLanguage: c.lang || 'en',
    timeRequired: c.duration || undefined,   // ISO 8601 e.g. PT6H
    isAccessibleForFree: !(offer && offer.price > 0),
    offers: offer
  }
})

// ItemList for discoverability (optional)
const courseList = courseNodes.length ? {
  '@type': 'ItemList',
  '@id': `${origin}/courses#itemlist`,
  name: 'CRM Analytics Academy — Courses',
  itemListElement: courseNodes.map((n, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    url: n.url,
    item: { '@id': n['@id'] }
  }))
} : null

useJsonld({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': cfg.org?.type || 'EducationalOrganization',
      '@id': orgId,
      name: cfg.org?.name || seo?.siteName || 'CRM Analytics Academy',
      legalName: cfg.org?.legalName || undefined,
      url: origin,
      logo: cfg.org?.logo ? { '@type': 'ImageObject', url: `${origin}${cfg.org.logo}` } : undefined,
      sameAs: cfg.org?.sameAs || [],
      areaServed: cfg.org?.areaServed || 'Worldwide'
    },
    {
      '@type': 'WebSite',
      '@id': siteId,
      url: origin,
      name: seo?.siteName || 'CRM Analytics Academy',
      publisher: { '@id': orgId }
      // (SearchAction not critical anymore, you can add if you want)
    },
    {
      '@type': 'Service',
      '@id': serviceId,
      name: cfg.service?.name || 'Salesforce CRM Analytics Training',
      serviceType: cfg.service?.serviceType || 'Online training',
      provider: { '@id': orgId },
      areaServed: cfg.org?.areaServed || 'Worldwide',
      availableChannel: cfg.service?.availableChannel || 'Online',
      url: origin,
      termsOfService: cfg.service?.termsPage ? `${origin}${cfg.service.termsPage}` : undefined
    },
    ...courseNodes,
    ...(courseList ? [courseList] : [])
  ]
})

provide('navigation', navigation)
</script>

<template>
  <Analytics/>
  <UApp>
    <NuxtLoadingIndicator />
    <AppHeader />
    <UMain>
      <NuxtLayout><NuxtPage /></NuxtLayout>
    </UMain>
    <AppFooter />
    <ClientOnly>
      <LazyUContentSearch :files="files" :navigation="navigation" />
    </ClientOnly>
  </UApp>
</template>