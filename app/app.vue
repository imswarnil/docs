<script setup lang="ts">
const { seo } = useAppConfig()

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), { server: false })

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: { lang: 'en' },                // ⬅️ missing comma previously
  script: [
    {
      id: 'adsbygoogle-js',
      async: true,
      src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1291242080282540',
      crossorigin: 'anonymous'
    }
  ]
})

useSeoMeta({
  titleTemplate: `%s - ${seo?.siteName}`,
  ogSiteName: seo?.siteName,
  twitterCard: 'summary_large_image'
})

provide('navigation', navigation)
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />
    <AppHeader />
    <div class="hidden lg:block mt-8 p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <ClientOnly>
              <GoogleAd
                ad-slot="7663977887"
                ad-format="auto"
                :fullWidth="true"
                ins-style="display:block"
                :refreshKey="page?.updatedAt || page?.path"
              />
            </ClientOnly>
    </div>
    <UMain>
      <NuxtLayout>
        <div class="hidden lg:block mt-8 p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <ClientOnly>
              <GoogleAd
                ad-slot="7663977887"
                ad-format="auto"
                :fullWidth="true"
                ins-style="display:block"
                :refreshKey="page?.updatedAt || page?.path"
              />
            </ClientOnly>
          </div>
        <NuxtPage />
        <div class="hidden lg:block mt-8 p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <ClientOnly>
              <GoogleAd
                ad-slot="7663977887"
                ad-format="auto"
                :fullWidth="true"
                ins-style="display:block"
                :refreshKey="page?.updatedAt || page?.path"
              />
            </ClientOnly>
          </div>
      </NuxtLayout>
      <div class="hidden lg:block mt-8 p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <ClientOnly>
              <GoogleAd
                ad-slot="7663977887"
                ad-format="auto"
                :fullWidth="true"
                ins-style="display:block"
                :refreshKey="page?.updatedAt || page?.path"
              />
            </ClientOnly>
          </div>
    </UMain>
    <AppFooter />
    <ClientOnly>
      <LazyUContentSearch :files="files" :navigation="navigation" />
    </ClientOnly>
  </UApp>
</template>
