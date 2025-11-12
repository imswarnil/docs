<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('landing').path('/').first())
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

const cfg = useAppConfig()
const title = page.value.seo?.title || page.value.title || cfg.seo?.siteName
const description = page.value.seo?.description || page.value.description || 'Learn Salesforce CRM Analytics.'
useSeoMeta({ titleTemplate: '', title, ogTitle: title, description, ogDescription: description })

const url = useRequestURL()
const origin = cfg.seo?.siteUrl || url.origin
const canonical = `${origin}/`
const orgId = `${origin}#organization`
const videoId = '_eQxomah-nA' // keep in sync with your iframe

useJsonld(() => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: title,
      description,
      isPartOf: { '@id': `${origin}#website` },
      about: { '@id': orgId },
      inLanguage: 'en'
    },
    {
      '@type': 'VideoObject',
      '@id': `${canonical}#intro-video`,
      name: 'CRM Analytics — Intro Trailer',
      description,
      thumbnailUrl: [
        `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
        `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      ],
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      contentUrl: `https://www.youtube.com/watch?v=${videoId}`,
      publisher: { '@id': orgId },
      isFamilyFriendly: true,
      inLanguage: 'en'
      // Add uploadDate / duration when it's your own upload
    }
  ]
}))
</script>

<template>
  <ContentRenderer v-if="page" :value="page" :prose="false" />
</template>
