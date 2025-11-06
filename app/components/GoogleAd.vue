<!-- components/content/GoogleAd.vue -->
<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({ name: 'GoogleAd' })

// All available ad variants, including a new 'text' variant
type Variant =
  | 'horizontal'
  | 'leaderboard'
  | 'rectangle'
  | 'vertical'
  | 'skyscraper'
  | 'square'
  | 'in-article'
  | 'in-feed'
  | 'multiplex'
  | 'text' // This will use a display ad unit optimized for text ads

const props = withDefaults(defineProps<{
  variant?: Variant
  /** Optional: Force reload on SPA navigation, automatically handled by watching route path */
  refreshKey?: string | number
}>(), {
  variant: 'horizontal',
})

// Your AdSense Publisher ID
const AD_CLIENT = 'ca-pub-1291242080282540'

// Your specific Ad Unit Slot IDs
const SLOTS = {
  HORIZONTAL: '8939839370', // Also used for 'text' variant
  VERTICAL:   '3487917390',
  SQUARE:     '7663977887',
  IN_ARTICLE: '6501428979',
  IN_FEED:    '9130894804',
  MULTIPLEX:  '6808134701'
} as const

const hostRef = ref<HTMLDivElement|null>(null)
const route = useRoute()
const isDev = process.dev

/** Load the Google AdSense script once per page load */
function ensureScript(): Promise<void> {
  return new Promise<void>((resolve) => {
    if (isDev) return resolve() // Don't load external scripts in dev mode
    // @ts-ignore
    if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) return resolve()
    
    let script = document.getElementById('adsbygoogle-js') as HTMLScriptElement | null
    if (!script) {
      script = document.createElement('script')
      script.id = 'adsbygoogle-js'
      script.async = true
      script.crossOrigin = 'anonymous'
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`
      script.onload = () => resolve()
      script.onerror = () => resolve() // Don't block the page on error
      document.head.appendChild(script)
    } else {
      resolve()
    }
  })
}

/** Dynamically create the <ins> ad tag with the correct attributes */
function buildInsElement(): HTMLInsElement {
  const el = document.createElement('ins')
  el.className = 'adsbygoogle'
  el.style.display = 'block'
  el.setAttribute('data-ad-client', AD_CLIENT)

  switch (props.variant) {
    case 'horizontal':
    case 'leaderboard':
    case 'rectangle':
    case 'text':
      el.setAttribute('data-ad-slot', SLOTS.HORIZONTAL)
      el.setAttribute('data-ad-format', 'auto')
      el.setAttribute('data-full-width-responsive', 'true')
      break

    case 'vertical':
    case 'skyscraper':
      el.setAttribute('data-ad-slot', SLOTS.VERTICAL)
      el.setAttribute('data-ad-format', 'auto')
      el.setAttribute('data-full-width-responsive', 'true')
      break

    case 'square':
      el.setAttribute('data-ad-slot', SLOTS.SQUARE)
      el.setAttribute('data-ad-format', 'auto')
      el.setAttribute('data-full-width-responsive', 'true')
      break

    case 'in-article':
      el.setAttribute('data-ad-layout', 'in-article')
      el.setAttribute('data-ad-format', 'fluid')
      el.setAttribute('data-ad-slot', SLOTS.IN_ARTICLE)
      el.style.textAlign = 'center'
      break

    case 'in-feed':
      el.setAttribute('data-ad-format', 'fluid')
      el.setAttribute('data-ad-layout-key', '-6v+f0-19-44+c6')
      el.setAttribute('data-ad-slot', SLOTS.IN_FEED)
      break

    case 'multiplex':
      el.setAttribute('data-ad-format', 'autorelaxed')
      el.setAttribute('data-ad-slot', SLOTS.MULTIPLEX)
      break
  }
  return el
}

/** The main function to render or re-render an ad */
async function renderAd() {
  if (isDev) return // Don't run ad logic in development
  
  const host = hostRef.value
  if (!host) return
  
  host.innerHTML = '' // Clear previous ad
  const ins = buildInsElement()
  host.appendChild(ins)

  try {
    // @ts-ignore
    const q = (window.adsbygoogle = window.adsbygoogle || [])
    q.push({})
  } catch (e) {
    console.error(`AdSense failed to push ad for variant "${props.variant}":`, e)
  }
}

// Load ad on initial mount
onMounted(async () => {
  await nextTick()
  await ensureScript()
  await renderAd()
})

// Refresh ad on every page navigation to ensure a new ad is loaded
watch(() => route.fullPath, async () => {
  await nextTick()
  // A small delay helps ensure the ad slot is ready after the page transition
  setTimeout(renderAd, 100)
}, { immediate: false }) // 'immediate: false' prevents it from running on initial load
</script>

<template>
  <!-- This outer div provides spacing and centers the ad unit -->
  <div class="my-6 w-full text-center">
    <!-- This is the styled frame that "hugs" the ad content -->
    <div
      class="inline-block p-2 rounded-lg border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20"
    >
      <!-- Development Mode: Show a helpful placeholder -->
      <div v-if="isDev" class="px-8 py-4 text-center text-slate-500 dark:text-slate-400">
        <p class="font-bold">Ad Slot</p>
        <p class="text-sm font-mono">{{ variant }}</p>
      </div>
      <!-- Production Mode: Mount the real ad -->
      <div v-else ref="hostRef" class="min-h-[50px] leading-none flex" />
    </div>
  </div>
</template>