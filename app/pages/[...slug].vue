<!-- pages/docs/[...slug].vue -->
<script setup lang="ts">
// All of your existing script setup logic remains the same.
// ...
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'

definePageMeta({ layout: 'docs' })

const route = useRoute()
const { toc } = useAppConfig()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { data: page } = await useAsyncData(route.path, () => queryContent().where({ _path: route.path }).findOne())
if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => queryContent().only(['_path', 'title', 'description']).findSurround(route.path))

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({ title, ogTitle: title, description, ogDescription: description })

const headline = computed(() => findPageHeadline(page.value))
defineOgImageComponent('Docs', { headline: headline.value })
</script>

<template>
  <div>
    <!-- Ad #1: A standard horizontal banner before the main page content -->
    <ClientOnly>
      <GoogleAd variant="horizontal" />
    </ClientOnly>

    <UPage v-if="page">
      <UPageHeader :title="page.title" :description="page.description" :headline="headline">
        <template #links>
          <UButton
            v-for="(link, index) in page.links"
            :key="index"
            v-bind="link"
          />
        </template>
      </UPageHeader>

      <UPageBody>
        <ContentRenderer :value="page" />

        <USeparator v-if="surround?.length" class="my-8" />
        <UContentSurround :surround="surround" />
        
        <!-- Ad #2: Multiplex ad at the very bottom of the page body -->
        <ClientOnly>
          <GoogleAd variant="multiplex" />
        </ClientOnly>
      </UPageBody>

      <!-- Right Sidebar TOC + Ads -->
      <template v-if="page.body?.toc?.links?.length" #right>
        <UContentToc :title="toc?.title" :links="page.body.toc.links">
          <template #bottom>
            <!-- Ad #3: Vertical ad, perfect for a sticky sidebar -->
            <ClientOnly>
              <GoogleAd variant="vertical" />
            </ClientOnly>
          </template>
        </UContentToc>
      </template>
    </UPage>
  </div>
</template>