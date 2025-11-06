<!-- pages/index.vue -->
<script setup lang="ts">
import { useSiteConfig } from '#imports'

const { data: page } = await useAsyncData('index', () => queryContent('/').findOne())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const siteConfig = useSiteConfig()

// --- SEO and Meta Tags ---
const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  titleTemplate: '', // Use the title directly for the homepage
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: `${siteConfig.url}/og-image-home.png`, // A specific OG image for home
  twitterCard: 'summary_large_image',
})

// --- Homepage-Specific JSON-LD ---
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'url': siteConfig.url,
        'name': title,
        'description': description,
        'potentialAction': {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': `${siteConfig.url}/search?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        }
      })
    }
  ]
})
</script>

<template>
  <div v-if="page">
    <ContentRenderer :value="page" />
  </div>
</template>