<!-- components/content/GoogleAd.vue -->
<script setup lang="ts">
import { ref, onMounted, nextTick, watch, computed } from 'vue'
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
  | 'text' // New variant to encourage text-based ads

// New prop to control the visual style of the ad wrapper
type DisplayStyle =
  | 'standard' // Default with background, border, and padding
  | 'minimal'  // No background or border, for clean integration
  | 'full-width' // Stretches to the full container width

const props = withDefaults(defineProps<{
  variant?: Variant
  displayStyle?: DisplayStyle
  /** Optional: Force reload on SPA navigation */
  refreshKey?: string | number
}>(), {
  variant: 'horizontal',
  displayStyle: 'standard',
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

// --- Logic for Dynamic Styling ---
const wrapperClasses = computed(() => {
  const base = 'flex justify-center w-full'
  if (props.displayStyle === 'full-width') return `${base} my-6 max-w-none`
  if (props.displayStyle === 'minimal') return `${base} my-4`
  return `${base} my-6` // Standard
})

const frameClasses = computed(() => {
  const base = 'w-full flex justify-center items-center'
  if (props.displayStyle === 'standard') {
    return `${base} bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-2`
  }
  return base // Minimal & Full-width have no extra frame styles
})

/** Load the Google AdSense script once per page load */
function ensureScript(): Promise<void> {
  return new Promise<void>((resolve) => {
    if (isDev) return resolve()
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
      script.onerror = () => resolve()
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
    case 'text': // Text ads use a standard responsive display unit
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
  if (isDev) return
  
  const host = hostRef.value
  if (!host) return
  
  host.innerHTML = ''
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

// Initial ad load on component mount
onMounted(async () => {
  await nextTick()
  await ensureScript()
  await renderAd()
})

// Re-render ad on route change
watch(() => [route.fullPath, props.variant, props.refreshKey], async () => {
  await nextTick()
  setTimeout(renderAd, 100)
})
</script>

<template>
  <div :class="wrapperClasses">
    <div :class="frameClasses">
      <!-- Development Mode: Show a helpful placeholder -->
      <div v-if="isDev" class="text-center text-slate-500 dark:text-slate-400 p-4">
        <p class="font-bold">Ad Slot</p>
        <p class="text-sm font-mono">{{ variant }}</p>
        <p v-if="displayStyle !== 'standard'" class="text-xs font-mono mt-1">({{ displayStyle }})</p>
      </div>
      <!-- Production Mode: Mount the real ad -->
      <div v-else ref="hostRef" class="w-full min-h-[90px]" />
    </div>
  </div>
</template>