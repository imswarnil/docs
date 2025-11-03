<script setup lang="ts">
const { seo } = useAppConfig()

// Docs nav + search (used by the hero quick search)
const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))
const { data: files } = useLazyAsyncData('search', () => queryCollectionSearchSections('docs'), { server: false })

useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: { lang: 'en' },
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
  title: 'CRM Analytics Training',
  titleTemplate: `%s · ${seo?.siteName ?? 'Imswarnil'}`,
  description: 'Learn Salesforce CRM Analytics (Tableau CRM/Einstein) with hands-on projects: Data Manager, Recipes, SAQL, Bindings, Security, and Dashboards.',
  ogTitle: 'CRM Analytics Training',
  ogSiteName: seo?.siteName ?? 'Imswarnil',
  twitterCard: 'summary_large_image'
})

const heroLinks = [
  { label: 'Get started', to: '/getting-started', icon: 'i-lucide-arrow-right', size: 'lg' },
  { label: 'View syllabus', to: '/docs/getting-started', color: 'neutral', variant: 'subtle', trailingIcon: 'i-lucide-book-open', size: 'lg' }
]

const tracks = [
  {
    title: 'Beginner',
    icon: 'i-lucide-rocket',
    desc: 'Data Manager, datasets, Recipes, dashboards basics.',
    to: '/docs/getting-started'
  },
  {
    title: 'Intermediate',
    icon: 'i-lucide-layers',
    desc: 'SAQL, bindings, faceting, query design patterns.',
    to: '/docs/essentials'
  },
  {
    title: 'Advanced',
    icon: 'i-lucide-shield-check',
    desc: 'Row-level security, performance, deployment, UX.',
    to: '/docs/advanced'
  }
]

const highlights = [
  { icon: 'i-lucide-bar-chart-3', title: 'Dashboards that convert', desc: 'Build KPI-first dashboards with responsive layouts & filters.' },
  { icon: 'i-lucide-database', title: 'Model your data', desc: 'Recipes, joins, augment & flatten with best practices.' },
  { icon: 'i-lucide-terminal', title: 'SAQL power', desc: 'Windowing, groupings, projections, and custom calculations.' },
  { icon: 'i-lucide-link', title: 'Bindings', desc: 'Truly interactive UIs with dynamic queries & controls.' },
  { icon: 'i-lucide-lock', title: 'Security', desc: 'RLS, predicates, and secure multi-tenant patterns.' },
  { icon: 'i-lucide-rocket', title: 'Ship to prod', desc: 'Packaging, migration strategies, and performance tuning.' }
]
</script>

<template>
  <div>
    <!-- HERO -->
    <section class="crma-hero relative bg-slds-glow">
      <UContainer class="py-14 lg:py-24">
        <div class="grid items-center gap-10 lg:grid-cols-2">
          <!-- Left: Title + CTA -->
          <div class="relative z-[1]">
            <p class="crma-kicker text-sm tracking-widest mb-3">Salesforce • CRM Analytics Training</p>
            <h1 class="crma-title">
              Learn <span class="text-primary">CRM Analytics</span> the<br class="hidden md:block" />
              way pros build dashboards.
            </h1>
            <p class="mt-5 text-lg text-muted max-w-prose">
              Master Recipes, SAQL, Bindings, and Security with hands-on, production-style lessons.
              Fully SLDS-inspired UI, fast search, and a clear learning path.
            </p>

            <!-- Quick search (client) -->
            <div class="mt-6">
              <ClientOnly>
                <LazyUContentSearch
                  class="max-w-2xl"
                  :files="files"
                  :navigation="navigation"
                  placeholder="Search lessons, modules, or topics (⌘/Ctrl + K)"
                />
              </ClientOnly>
            </div>

            <!-- CTAs -->
            <div class="mt-7 flex flex-wrap items-center gap-3">
              <UButton
                v-for="(link, idx) in heroLinks"
                :key="idx"
                v-bind="link"
              />
              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-play-circle"
                to="https://www.youtube.com/@imswarnil"
                target="_blank"
              >
                Watch intro
              </UButton>
            </div>
          </div>

          <!-- Right: Syllabus card -->
          <div class="relative">
            <UCard class="island">
              <template #header>
                <div class="flex items-center gap-2">
                  <UIcon name="i-lucide-list-checks" class="size-5 text-primary" />
                  <span class="font-semibold">Mini syllabus</span>
                </div>
              </template>

              <ul class="space-y-3 text-sm">
                <li class="flex items-start gap-2">
                  <UIcon name="i-lucide-check-circle-2" class="mt-0.5 size-4 text-primary" />
                  Data Manager, datasets, Recipes (augment/flatten, joins)
                </li>
                <li class="flex items-start gap-2">
                  <UIcon name="i-lucide-check-circle-2" class="mt-0.5 size-4 text-primary" />
                  SAQL fundamentals → windowing, groupings, projections
                </li>
                <li class="flex items-start gap-2">
                  <UIcon name="i-lucide-check-circle-2" class="mt-0.5 size-4 text-primary" />
                  Bindings for interactive filters & dynamic queries
                </li>
                <li class="flex items-start gap-2">
                  <UIcon name="i-lucide-check-circle-2" class="mt-0.5 size-4 text-primary" />
                  Row-level security, predicates & deployment
                </li>
              </ul>

              <template #footer>
                <div class="flex items-center justify-between">
                  <UButton size="sm" icon="i-lucide-arrow-right" to="/getting-started">Start now</UButton>
                  <UButton size="sm" variant="subtle" color="neutral" to="/docs/getting-started">
                    Full outline
                  </UButton>
                </div>
              </template>
            </UCard>
          </div>
        </div>
      </UContainer>

      <!-- Decorative orbs -->
      <div class="crma-circle crma-circle--lg"></div>
      <div class="crma-circle crma-circle--sm"></div>
    </section>

    <!-- Ad slot (hero bottom) -->
    <UContainer>
      <div class="ad-card mt-6">
        <ClientOnly>
          <GoogleAd
            ad-slot="7663977887"
            ad-format="auto"
            :fullWidth="true"
            ins-style="display:block"
            :refreshKey="$route.fullPath"
          />
        </ClientOnly>
      </div>
    </UContainer>

    <!-- TRACKS -->
    <section class="py-12 lg:py-16">
      <UContainer>
        <div class="mb-6 flex items-center justify-between gap-4">
          <h2 class="text-2xl font-bold text-highlighted">Choose your path</h2>
          <UButton to="/docs/getting-started" variant="subtle" color="neutral" trailing-icon="i-lucide-arrow-right">
            See all modules
          </UButton>
        </div>

        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <UCard v-for="t in tracks" :key="t.title" class="nav-card">
            <div class="flex items-start gap-3">
              <UIcon :name="t.icon" class="size-6 text-primary" />
              <div>
                <h3 class="font-semibold">{{ t.title }}</h3>
                <p class="text-sm text-muted mt-1">{{ t.desc }}</p>
                <div class="mt-3">
                  <UButton size="sm" color="primary" :to="t.to" trailing-icon="i-lucide-arrow-right">Explore</UButton>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </UContainer>
    </section>

    <!-- HIGHLIGHTS -->
    <section class="py-8 lg:py-10 bg-dots-soft">
      <UContainer>
        <h2 class="text-2xl font-bold text-highlighted mb-6">What you’ll master</h2>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <UCard v-for="h in highlights" :key="h.title" class="island">
            <div class="flex items-start gap-3">
              <UIcon :name="h.icon" class="size-6 text-primary" />
              <div>
                <h3 class="font-semibold">{{ h.title }}</h3>
                <p class="text-sm text-muted mt-1">{{ h.desc }}</p>
              </div>
            </div>
          </UCard>
        </div>
      </UContainer>
    </section>

    <!-- FEATURED PROJECT -->
    <section class="py-12 lg:py-16">
      <UContainer>
        <div class="grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <UBadge color="primary" variant="soft" class="mb-3">Hands-on</UBadge>
            <h2 class="text-2xl font-bold text-highlighted">Build a Revenue Command Center</h2>
            <p class="mt-3 text-muted">
              Create a full dashboard with company-level metrics, cohort trends, and drilldowns.
              Learn data modeling, SAQL windows, and production-grade bindings.
            </p>
            <div class="mt-5 flex gap-3">
              <UButton to="/docs/essentials" icon="i-lucide-hammer">Start project</UButton>
              <UButton to="/docs/essentials" variant="subtle" color="neutral" trailing-icon="i-lucide-arrow-right">
                Read guide
              </UButton>
            </div>
          </div>
          <UCard class="island">
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-bar-chart-big" class="size-5 text-primary" />
                <span class="font-semibold">Preview</span>
              </div>
            </template>
            <NuxtImg
              src="/assets/templates/nuxt/dashboard-dark.png"
              alt="CRM Analytics Dashboard Preview"
              class="rounded-md border border-(--ui-border) w-full"
              :placeholder="[20,20]"
            />
          </UCard>
        </div>
      </UContainer>
    </section>

    <!-- Ad slot (mid page) -->
    <UContainer>
      <div class="ad-card mt-2">
        <ClientOnly>
          <GoogleAd
            ad-slot="7663977887"
            ad-format="auto"
            :fullWidth="true"
            ins-style="display:block"
            :refreshKey="$route.fullPath + '-mid'"
          />
        </ClientOnly>
      </div>
    </UContainer>

    <!-- FAQ (Accordion) -->
    <section class="py-12 lg:py-16">
      <UContainer>
        <h2 class="text-2xl font-bold text-highlighted mb-6">FAQ</h2>
        <UAccordion
          multiple
          :items="[
            { label: 'Is this beginner friendly?', content: 'Yes. We start with Data Manager, Recipes, and dashboards before SAQL & bindings.' },
            { label: 'Do I need Salesforce org access?', content: 'Recommended. You can still learn concepts and replicate in a Dev/Sandbox.' },
            { label: 'Will I learn SAQL?', content: 'Absolutely—windowing, projections, query anatomy, and practical patterns.' }
          ]"
        />
      </UContainer>
    </section>

    <!-- CTA -->
    <section class="py-14 lg:py-20 bg-slds-glow">
      <UContainer>
        <UCard class="island">
          <div class="grid gap-6 lg:grid-cols-2 items-center">
            <div>
              <h2 class="text-2xl font-bold text-highlighted">Ready to build production-grade analytics?</h2>
              <p class="mt-2 text-muted">Follow the structured path, ship real dashboards, and level up your Salesforce career.</p>
              <div class="mt-5 flex flex-wrap gap-3">
                <UButton to="/getting-started" icon="i-lucide-arrow-right">Get started</UButton>
                <UButton to="/docs/getting-started" color="neutral" variant="subtle" trailing-icon="i-lucide-book-open">
                  Explore docs
                </UButton>
              </div>
            </div>
            <div class="ad-card">
              <ClientOnly>
                <GoogleAd
                  ad-slot="7663977887"
                  ad-format="auto"
                  :fullWidth="true"
                  ins-style="display:block"
                  :refreshKey="$route.fullPath + '-cta'"
                />
              </ClientOnly>
            </div>
          </div>
        </UCard>
      </UContainer>
    </section>
  </div>
</template>
