<!-- pages/docs/[...slug].vue -->
<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'

definePageMeta({ layout: 'docs' })

const route = useRoute()
const { toc } = useAppConfig()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { data: page } = await useAsyncData(route.path, () => queryContent(route.path).findOne())
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
    <!-- (1) Top of page: leaderboard -->
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
          <!-- Assuming PageHeaderLinks is a custom component -->
        </template>
      </UPageHeader>

      <!-- (2) Under header: horizontal responsive -->
      <ClientOnly>
        <GoogleAd variant="horizontal" :refresh-key="route.path" />
      </ClientOnly>

      <UPageBody>
        <!-- (3) In-article (fluid) before content -->
        <ClientOnly>
          <GoogleAd variant="in-article" :refresh-key="route.path" />
        </ClientOnly>

        <ContentRenderer v-if="page.body" :value="page" />

        <!-- (4) In-article between content & surround links -->
        <ClientOnly>
          <GoogleAd variant="in-article" :refresh-key="route.path" />
        </ClientOnly>

        <hr v-if="surround?.filter(Boolean).length" class="my-8" />
        
        <UContentSurround :surround="surround" />
        
        <!-- (5) Multiplex (matched content) at bottom of body -->
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
              <!-- Removed UPageLinks as it seems for navigation, not ads -->
            </div>

            <!-- (6) Square (responsive, clamped to 250px) -->
            <ClientOnly>
              <GoogleAd variant="square" :refresh-key="route.path" />
            </ClientOnly>

            <!-- (7) Strict 250x250 -->
            <ClientOnly>
              <GoogleAd variant="square-fixed" :refresh-key="route.path" />
            </ClientOnly>

            <!-- (8) Vertical (responsive) -->
            <ClientOnly>
              <GoogleAd variant="vertical" :refresh-key="route.path" />
            </ClientOnly>
          </template>
        </UContentToc>
      </template>
    </UPage>

    <!-- (9) Footer-ish horizontal -->
    <ClientOnly>
      <GoogleAd variant="horizontal" :refresh-key="route.path" />
    </ClientOnly>
  </div>
</template>