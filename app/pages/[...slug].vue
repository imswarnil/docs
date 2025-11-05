<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'

definePageMeta({
  layout: 'docs'
})

const route = useRoute()
const { toc } = useAppConfig()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { data: page } = await useAsyncData(route.path, () => queryCollection('docs').path(route.path).first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('docs', route.path, {
    fields: ['description']
  })
})

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

const headline = computed(() => findPageHeadline(navigation?.value, page.value?.path))

defineOgImageComponent('Docs', {
  headline: headline.value
})

const links = computed(() => {
  const links = []
  if (toc?.bottom?.edit) {
    links.push({
      icon: 'i-lucide-external-link',
      label: 'Edit this page',
      to: `${toc.bottom.edit}/${page?.value?.stem}.${page?.value?.extension}`,
      target: '_blank'
    })
  }

  return [...links, ...(toc?.bottom?.links || [])].filter(Boolean)
})
</script>

<template>
  <UPage v-if="page">
    <UPageHeader
      :title="page.title"
      :description="page.description"
      :headline="headline"
    >
      <template #links>
        <UButton
          v-for="(link, index) in page.links"
          :key="index"
          v-bind="link"
        />
        <PageHeaderLinks />
      </template>
    </UPageHeader>

    <!-- Sidebar Ad -->
    <div class="my-6 flex justify-center">
  <ClientOnly>
    <template #fallback>
      <AdPlaceholder variant="square" :maxWidth="'250px'" badge="Ad" label="Advertisement" />
    </template>

    <!-- Fixed-size square container -->
    <div style="display:inline-block; width:250px; height:250px;">
      <GoogleAd
        ad-slot="YOUR_250x250_SLOT_ID"
        :fullWidth="false"
        ins-style="display:inline-block;width:250px;height:250px"
      />
    </div>
  </ClientOnly>
</div>

    <UPageBody>
      <ContentRenderer
        v-if="page"
        :value="page"
      />
      <USeparator v-if="surround?.length" />
      <UContentSurround :surround="surround" />
    </UPageBody>

    <ClientOnly>
  <GoogleAd kind="square" />
</ClientOnly>

   
    <!-- Right Sidebar TOC + Ads -->
    <template v-if="page?.body?.toc?.links?.length" #right>
      <UContentToc
        :title="toc?.title"
        :links="page.body?.toc?.links"
      >
        <template v-if="toc?.bottom" #bottom>
          <div
            class="hidden lg:block space-y-6"
            :class="{ '!mt-6': page.body?.toc?.links?.length }"
          >
            <USeparator
              v-if="page.body?.toc?.links?.length"
              type="dashed"
            />

          <ClientOnly>
  <GoogleAd kind="leaderboard" :maxWidth="'728px'" />
</ClientOnly>


          <USeparator
              v-if="page.body?.toc?.links?.length"
              type="dashed"
            />

            <UPageLinks
              :title="toc.bottom.title"
              :links="links"
            />
          </div>

          <!-- Sidebar Ad -->
          <div class=" lg:block mt-8 p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <ClientOnly>
              <GoogleAd
                ad-slot="7663977887"
                :fullWidth="true"
                ins-style="display:block"
                :refreshKey="page?.updatedAt || page?.path"
              />
            </ClientOnly>
          </div>
          
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>
