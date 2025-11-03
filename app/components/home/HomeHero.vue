<template>
    <section class="crma-hero py-14 md:py-24">
      <UContainer>
        <div class="grid md:grid-cols-[1.1fr,0.9fr] items-center gap-10">
          <!-- Copy -->
          <div>
            <p class="crma-kicker mb-2">Tableau</p>
            <h1 class="crma-title">CRM Analytics Training</h1>
            <p class="mt-4 text-lg text-slate-700 dark:text-slate-300 max-w-prose">
              Learn dashboards, recipes, lenses, and Einstein magic—packaged the SLDS way.
            </p>
            <div class="mt-6 flex gap-3">
              <UButton size="lg" to="/getting-started" trailing-icon="i-lucide-arrow-right">Get started</UButton>
              <UButton size="lg" color="neutral" variant="outline" icon="i-simple-icons-github" target="_blank"
                       to="https://github.com/nuxt-ui-templates/docs">GitHub</UButton>
            </div>
          </div>
  
          <!-- Visual (optional Einstein / illustration) -->
          <div class="relative h-48 md:h-72">
            <!-- Replace with your asset or remove entire block -->
            <NuxtImg src="/images/einstein.png" alt="Einstein" class="absolute bottom-0 right-0 h-full object-contain" />
          </div>
        </div>
      </UContainer>
  
      <!-- Decorative circles -->
      <div aria-hidden="true" class="crma-circle crma-circle--lg"></div>
      <div aria-hidden="true" class="crma-circle crma-circle--sm"></div>
    </section>
  </template>
  