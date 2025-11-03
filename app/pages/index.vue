<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('landing').path('/').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/docs-light.png',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/docs-light.png'
})
</script>

<template>
  <div>
    <!-- HERO -->
    <section class="crma-hero relative">
      <UContainer class="py-14 lg:py-24">
        <div class="grid items-center gap-10 lg:grid-cols-2">
          <!-- Left: Title + CTA -->
          <div class="relative z-[1]">
            <p class="crma-kicker text-sm tracking-widest mb-3">
              Salesforce • CRM Analytics Training
            </p>

            <h1 class="crma-title">
              Learn <span class="text-primary">CRM Analytics</span> the
              <br class="hidden md:block" />production way.
            </h1>

            <p class="mt-5 text-lg text-muted max-w-prose">
              Master Recipes, SAQL, Bindings, and Security with hands-on lessons.
              SLDS-inspired UI, fast search, and a clear learning path.
            </p>

            <div class="mt-7 flex flex-wrap items-center gap-3">
              <UButton
                size="lg"
                icon="i-lucide-arrow-right"
                to="/getting-started"
              >
                Get started
              </UButton>

              <UButton
                size="lg"
                color="neutral"
                variant="subtle"
                trailing-icon="i-lucide-book-open"
                to="/docs/getting-started"
              >
                View syllabus
              </UButton>

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

          <!-- Right: Mini syllabus card -->
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
                  <UButton size="sm" variant="subtle" color="neutral" to="/docs/getting-started">Full outline</UButton>
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
            :refreshKey="$route.fullPath + '-hero'"
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
          <UCard class="nav-card">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-rocket" class="size-6 text-primary" />
              <div>
                <h3 class="font-semibold">Beginner</h3>
                <p class="text-sm text-muted mt-1">
                  Data Manager, datasets, Recipes, dashboard basics.
                </p>
                <div class="mt-3">
                  <UButton size="sm" color="primary" to="/docs/getting-started" trailing-icon="i-lucide-arrow-right">
                    Explore
                  </UButton>
                </div>
              </div>
            </div>
          </UCard>

          <UCard class="nav-card">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-layers" class="size-6 text-primary" />
              <div>
                <h3 class="font-semibold">Intermediate</h3>
                <p class="text-sm text-muted mt-1">
                  SAQL, bindings, faceting, query design patterns.
                </p>
                <div class="mt-3">
                  <UButton size="sm" color="primary" to="/docs/essentials" trailing-icon="i-lucide-arrow-right">
                    Explore
                  </UButton>
                </div>
              </div>
            </div>
          </UCard>

          <UCard class="nav-card">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-shield-check" class="size-6 text-primary" />
              <div>
                <h3 class="font-semibold">Advanced</h3>
                <p class="text-sm text-muted mt-1">
                  Row-level security, performance, deployment, UX.
                </p>
                <div class="mt-3">
                  <UButton size="sm" color="primary" to="/docs/advanced" trailing-icon="i-lucide-arrow-right">
                    Explore
                  </UButton>
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
          <UCard class="island">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-bar-chart-3" class="size-6 text-primary" />
              <div>
                <h3 class="font-semibold">Dashboards that convert</h3>
                <p class="text-sm text-muted mt-1">KPI-first layouts & filters.</p>
              </div>
            </div>
          </UCard>

          <UCard class="island">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-database" class="size-6 text-primary" />
              <div>
                <h3 class="font-semibold">Model your data</h3>
                <p class="text-sm text-muted mt-1">Recipes, joins, augment & flatten.</p>
              </div>
            </div>
          </UCard>

          <UCard class="island">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-terminal" class="size-6 text-primary" />
              <div>
                <h3 class="font-semibold">SAQL power</h3>
                <p class="text-sm text-muted mt-1">Windows, groupings, projections.</p>
              </div>
            </div>
          </UCard>

          <UCard class="island">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-link" class="size-6 text-primary" />
              <div>
                <h3 class="font-semibold">Bindings</h3>
                <p class="text-sm text-muted mt-1">Dynamic queries & interactions.</p>
              </div>
            </div>
          </UCard>

          <UCard class="island">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-lock" class="size-6 text-primary" />
              <div>
                <h3 class="font-semibold">Security</h3>
                <p class="text-sm text-muted mt-1">RLS, predicates, multi-tenant.</p>
              </div>
            </div>
          </UCard>

          <UCard class="island">
            <div class="flex items-start gap-3">
              <UIcon name="i-lucide-rocket" class="size-6 text-primary" />
              <div>
                <h3 class="font-semibold">Ship to prod</h3>
                <p class="text-sm text-muted mt-1">Packaging & performance.</p>
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

    <!-- FAQ -->
    <section class="py-12 lg:py-16">
      <UContainer>
        <h2 class="text-2xl font-bold text-highlighted mb-6">FAQ</h2>
        <UAccordion multiple :items="[
          { label: 'Is this beginner friendly?', content: 'Yes. We start with Data Manager, Recipes, and dashboards before SAQL & bindings.' },
          { label: 'Do I need Salesforce org access?', content: 'Recommended. You can still learn concepts and replicate in a Dev/Sandbox.' },
          { label: 'Will I learn SAQL?', content: 'Absolutely—windowing, projections, query anatomy, and practical patterns.' }
        ]" />
      </UContainer>
    </section>

    <!-- CTA -->
    <section class="py-14 lg:py-20">
      <UContainer>
        <UCard class="island">
          <div class="grid gap-6 lg:grid-cols-2 items-center">
            <div>
              <h2 class="text-2xl font-bold text-highlighted">
                Ready to build production-grade analytics?
              </h2>
              <p class="mt-2 text-muted">
                Follow the structured path, ship real dashboards, and level up your Salesforce career.
              </p>
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


<template>
  <ContentRenderer
    v-if="page"
    :value="page"
    :prose="false"
  />
</template>
