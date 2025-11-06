<!-- pages/docs/[...slug].vue -->
<script setup lang="ts">
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
  <div> <!-- Added a root div to contain all elements -->
    <!-- Ad #1: Full-width banner at the very top -->
    <ClientOnly>
      <GoogleAd variant="horizontal" display-style="full-width" :refresh-key="route.path" />
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
        <!-- Ad #2: Minimal text ad before main content -->
        <ClientOnly>
          <GoogleAd variant="text" display-style="minimal" :refresh-key="route.path" />
        </ClientOnly>

        <ContentRenderer :value="page" />

        <!-- Ad #3: Standard in-article ad between content and surround links -->
        <ClientOnly>
          <GoogleAd variant="in-article" display-style="standard" :refresh-key="route.path" />
        </ClientOnly>

        <USeparator v-if="surround?.length" class="my-8" />

        <UContentSurround :surround="surround" />

        <!-- Ad #4: Multiplex ad at the bottom of the body -->
        <ClientOnly>
          <GoogleAd variant="multiplex" :refresh-key="route.path" />
        </ClientOnly>
      </UPageBody>

      <!-- Right Sidebar TOC + Ads -->
      <template v-if="page.body?.toc?.links?.length" #right>
        <UContentToc :title="toc?.title" :links="page.body.toc.links">
          <template v-if="toc?.bottom" #bottom>
            <div class="hidden lg:block space-y-6" :class="{ '!mt-6': page.body?.toc?.links?.length }">
              <USeparator v-if="page.body.toc.links.length" type="dashed" />
            </div>

            <!-- Ad #5: Vertical ad for the sidebar -->
            <ClientOnly>
              <GoogleAd variant="vertical" :refresh-key="route.path" />
            </ClientOnly>

            <!-- Ad #6: Square ad, also great for sidebars -->
            <ClientOnly>
              <GoogleAd variant="square" :refresh-key="route.path" />
            </ClientOnly>
          </template>
        </UContentToc>
      </template>
    </UPage>
  </div>
</template>