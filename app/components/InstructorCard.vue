<!-- components/content/InstructorCard.vue -->
<script setup lang="ts">
defineProps({
  name: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  github: {
    type: String,
    default: ''
  },
  twitter: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="text-center">
    <UAvatar
      :src="avatar"
      :alt="name"
      size="3xl"
      class="mb-2"
    />
    <p class="text-lg font-bold text-gray-900 dark:text-white">
      {{ name }}
    </p>
    <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
      {{ title }}
    </p>
    <div class="flex justify-center items-center gap-2">
      <UButton
        v-if="github"
        :to="`https://github.com/${github}`"
        target="_blank"
        icon="i-simple-icons-github"
        color="gray"
        variant="ghost"
        aria-label="GitHub"
      />
      <UButton
        v-if="twitter"
        :to="`https://twitter.com/${twitter}`"
        target="_blank"
        icon="i-simple-icons-x"
        color="gray"
        variant="ghost"
        aria-label="Twitter / X"
      />
    </div>
  </div>
</template>