<script setup lang="ts">
type Card = {
  title: string
  description?: string
  icon?: string
  to?: string
}

const props = withDefaults(defineProps<{
  items?: Card[]
}>(), {
  items: () => ([
    {
      title: 'Icons',
      description: 'Nuxt UI integrates with Nuxt Icon to access over 200,000+ icons from Iconify.',
      icon: 'i-lucide-smile',
      to: '/docs/getting-started/integrations/icons'
    },
    {
      title: 'Fonts',
      description: 'Nuxt UI integrates with Nuxt Fonts to provide plug-and-play font optimization.',
      icon: 'i-lucide-a-large-small',
      to: '/docs/getting-started/integrations/fonts'
    },
    {
      title: 'Color Mode',
      description: 'Nuxt UI integrates with Nuxt Color Mode to switch between light and dark.',
      icon: 'i-lucide-sun-moon',
      to: '/docs/getting-started/integrations/color-mode'
    }
  ])
})
</script>

<template>
  <UPageGrid>
    <UPageCard
      v-for="(card, index) in props.items"
      :key="index"
      v-bind="card"
    />
  </UPageGrid>
</template>
