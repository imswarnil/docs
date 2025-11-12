<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'

definePageMeta({ layout: 'docs' })

const route = useRoute()
const { toc } = useAppConfig()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { data: page } = await useAsyncData(route.path, () => queryCollection('docs').path(route.path).first())
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('docs', route.path, { fields: ['description'] })
})

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description
useSeoMeta({ title, ogTitle: title, description, ogDescription: description })

const headline = computed(() => findPageHeadline(navigation?.value, page.value?.path))
defineOgImageComponent('Docs', { headline: headline.value })

/* -------- JSON-LD for docs pages -------- */
const cfg = useAppConfig()
const reqUrl = useRequestURL()
const origin = cfg.seo?.siteUrl || reqUrl.origin
const canonical = `${origin}${route.path}`
const orgId = `${origin}#organization`

// naive breadcrumb from the route path + current page title
const segments = route.path.split('/').filter(Boolean)     // ["getting-started","installation"]
const crumbItems = segments.map((seg, i) => {
  const url = `${origin}/${segments.slice(0, i + 1).join('/')}`
  const pretty = seg.replace(/-/g, ' ').replace(/\b\w/g, m => m.toUpperCase())
  return { '@type': 'ListItem', position: i + 1, name: pretty, item: url }
})
const breadcrumbNode = {
  '@type': 'BreadcrumbList',
  '@id': `${canonical}#breadcrumb`,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: origin },
    ...crumbItems
  ]
}

// TechArticle by default; switch to HowTo if page front-matter says so
const isHowTo = !!page.value?.howto
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
      breadcrumb: { '@id': `${canonical}#breadcrumb` },
      inLanguage: 'en',
      about: { '@id': orgId }
    },
    breadcrumbNode,
    isHowTo
      ? {
          '@type': 'HowTo',
          '@id': `${canonical}#howto`,
          name: title,
          description,
          mainEntityOfPage: { '@id': `${canonical}#webpage` },
          totalTime: page.value?.duration || undefined, // e.g., PT15M
          supply: page.value?.supply || undefined,      // optional array
          tool: page.value?.tool || undefined           // optional array
          // steps: you can emit structured steps if you store them in front-matter
        }
      : {
          '@type': 'TechArticle',
          '@id': `${canonical}#article`,
          headline: title,
          description,
          mainEntityOfPage: { '@id': `${canonical}#webpage` },
          author: { '@id': orgId },
          publisher: { '@id': orgId },
          inLanguage: 'en'
        }
  ]
}))
</script>

<template>
  <!-- your existing template unchanged -->
  <ClientOnly><GoogleAd variant="leaderboard" /></ClientOnly>

  <UPage v-if="page">
    <UPageHeader :title="page.title" :description="page.description" :headline="headline">
      <template #links>
        <UButton v-for="(link, index) in page.links" :key="index" v-bind="link" />
        <PageHeaderLinks />
      </template>
    </UPageHeader>

    <UPageBody>
      <ContentRenderer v-if="page" :value="page" />
      <USeparator v-if="surround?.length" />
      <UContentSurround :surround="surround" />
    </UPageBody>

    <template v-if="page?.body?.toc?.links?.length" #right>
      <UContentToc :title="toc?.title" :links="page.body?.toc?.links">
        <template v-if="toc?.bottom" #bottom>
          <div class="hidden lg:block space-y-6" :class="{ '!mt-6': page.body?.toc?.links?.length }">
            <USeparator v-if="page.body?.toc?.links?.length" type="dashed" />
            <UPageLinks :title="toc.bottom.title" :links="[]" />
          </div>
          <ClientOnly><GoogleAd variant="square" /></ClientOnly>
          <ClientOnly><GoogleAd variant="rectangle" /></ClientOnly>
          <ClientOnly><GoogleAd variant="vertical" /></ClientOnly>
        </template>
      </UContentToc>
    </template>
  </UPage>

  <ClientOnly><GoogleAd variant="multiplex" /></ClientOnly>
</template>
