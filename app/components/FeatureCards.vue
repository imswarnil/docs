<script setup lang="ts">
type Card = {
  title: string
  description?: string
  icon?: string
  to?: string
}

const props = withDefaults(defineProps<{
  /** Optional: pass cards from MDC */
  items?: Card[]
}>(), {})

// Fallback sample (optional) – remove if you always pass `items`
const fallback: Card[] = [
  { title: 'Icons', description: 'Nuxt UI integrates with Nuxt Icon to access 200k+ icons.', icon: 'i-lucide-smile', to: '/docs/getting-started/integrations/icons' },
  { title: 'Fonts', description: 'Nuxt Fonts for plug-and-play font optimization.', icon: 'i-lucide-a-large-small', to: '/docs/getting-started/integrations/fonts' },
  { title: 'Color Mode', description: 'Switch between light and dark.', icon: 'i-lucide-sun-moon', to: '/docs/getting-started/integrations/color-mode' }
]

const cards = computed(() => props.items?.length ? props.items : fallback)
</script>

<template>
  <UPageGrid>
    <UPageCard
      v-for="(card, i) in cards"
      :key="i"
      v-bind="card"
    />
  </UPageGrid>
</template>
