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
</script>

<template>
 <!-- Ad placed at the top of the page -->
    <ClientOnly>
      <GoogleAd variant="leaderboard" :refresh-key="route.path" />
    </ClientOnly>

  <UPage v-if="page">
    <UPageHeader :title="page.title" :description="page.description" :headline="headline">
      <template #links>
        <UButton
          v-for="(link, index) in page.links"
          :key="index"
          v-bind="link"
        />
        <PageHeaderLinks />
      </template>
    </UPageHeader>

    <ClientOnly>
      <GoogleAd variant="rectangle" :refresh-key="route.path" />
    </ClientOnly>
    <UPageBody>
      <!-- (3) In-article (fluid) before content -->
      <ClientOnly>
        <GoogleAd variant="in-article" />
      </ClientOnly>

      <ContentRenderer v-if="page" :value="page" />

      <!-- (4) In-article between content & surround -->
      <ClientOnly>
        <GoogleAd variant="in-article" />
      </ClientOnly>

      <USeparator v-if="surround?.length" />

      <!-- (5) Multiplex at bottom of body -->
      <ClientOnly>
        <GoogleAd variant="multiplex" />
      </ClientOnly>

      <UContentSurround :surround="surround" />
    </UPageBody>

    <!-- Right Sidebar TOC + Ads -->
    <template v-if="page?.body?.toc?.links?.length" #right>
      <UContentToc :title="toc?.title" :links="page.body?.toc?.links">
        <template v-if="toc?.bottom" #bottom>
          <div class="hidden lg:block space-y-6" :class="{ '!mt-6': page.body?.toc?.links?.length }">
            <USeparator v-if="page.body?.toc?.links?.length" type="dashed" />
            <UPageLinks :title="toc.bottom.title" :links="[]" />
          </div>

          <!-- (6) Square (responsive, clamped to 250px) -->
          <ClientOnly>
            <GoogleAd variant="square" />
          </ClientOnly>

          <!-- (7) Strict 250x250 -->
          <ClientOnly>
            <GoogleAd variant="square-fixed" />
          </ClientOnly>

          <!-- (8) Vertical (responsive) -->
          <ClientOnly>
            <GoogleAd variant="vertical" />
          </ClientOnly>
        </template>
      </UContentToc>
    </template>
  </UPage>

  <!-- (9) Footer-ish horizontal -->
  <ClientOnly>
    <GoogleAd variant="horizontal" />
  </ClientOnly>
</template>
