<!-- components/GoogleAd.vue -->
<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({ name: 'GoogleAd' })

// Added 'in-feed' to the list of variants
type Variant =
  | 'leaderboard'
  | 'large-leaderboard'
  | 'small-leaderboard'
  | 'square'
  | 'wide-skyscraper'
  | 'skyscraper'
  | 'rectangle'
  | 'horizontal'
  | 'vertical'
  | 'in-article'
  | 'in-feed' // New variant for In-feed ads
  | 'multiplex'

const props = withDefaults(defineProps<{
  variant?: Variant
  /** Force reload when content changes (e.g., on route change) */
  refreshKey?: string | number
}>(), {
  variant: 'horizontal',
})

// Using your provided AdSense Client ID
const AD_CLIENT = 'ca-pub-1291242080282540'

// Using your exact Slot IDs from the ad codes
const SLOTS = {
  HORIZONTAL: '8939839370',
  VERTICAL:   '3487917390',
  SQUARE:     '7663977887',
  IN_ARTICLE: '6501428979',
  IN_FEED:    '9130894804',
  MULTIPLEX:  '6808134701'
} as const

const hostRef = ref<HTMLDivElement|null>(null)
const route = useRoute()
const isDev = process.dev

/** Load AdSense script once, ensuring it's ready before ads are pushed. */
function ensureScript(): Promise<void> {
  return new Promise<void>((resolve) => {
    if (isDev) {
      // Don't load external scripts in development for faster performance
      return resolve()
    }
    // @ts-ignore
    if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
      return resolve()
    }
    
    let s = document.getElementById('adsbygoogle-js') as HTMLScriptElement | null
    if (!s) {
      s = document.createElement('script')
      s.id = 'adsbygoogle-js'
      s.async = true // Use async=true as recommended by Google
      s.crossOrigin = 'anonymous'
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`
      s.onload = () => resolve()
      s.onerror = () => resolve() // Resolve on error to not block the page
      document.head.appendChild(s)
    } else {
      resolve()
    }
  })
}

/** Creates the <ins> element with the correct attributes for the variant. */
function buildInsElement(): HTMLInsElement {
  const el = document.createElement('ins')
  el.className = 'adsbygoogle'
  el.setAttribute('data-ad-client', AD_CLIENT)
  el.style.display = 'block' // Common style for all modern ad units

  switch (props.variant) {
    // Responsive Display Ads
    case 'horizontal':
    case 'leaderboard': // Maps to responsive horizontal
    case 'large-leaderboard':
    case 'small-leaderboard':
    case 'rectangle':
      el.setAttribute('data-ad-slot', SLOTS.HORIZONTAL)
      el.setAttribute('data-ad-format', 'auto')
      el.setAttribute('data-full-width-responsive', 'true')
      break

    case 'vertical':
    case 'skyscraper': // Maps to responsive vertical
    case 'wide-skyscraper':
      el.setAttribute('data-ad-slot', SLOTS.VERTICAL)
      el.setAttribute('data-ad-format', 'auto')
      el.setAttribute('data-full-width-responsive', 'true')
      break

    case 'square':
      el.setAttribute('data-ad-slot', SLOTS.SQUARE)
      el.setAttribute('data-ad-format', 'auto')
      el.setAttribute('data-full-width-responsive', 'true')
      break

    // Special Fluid/Native Ads
    case 'in-article':
      el.setAttribute('data-ad-layout', 'in-article')
      el.setAttribute('data-ad-format', 'fluid')
      el.setAttribute('data-ad-slot', SLOTS.IN_ARTICLE)
      el.style.textAlign = 'center'
      break

    case 'in-feed':
      el.setAttribute('data-ad-format', 'fluid')
      el.setAttribute('data-ad-layout-key', '-6v+f0-19-44+c6') // Specific key for In-feed
      el.setAttribute('data-ad-slot', SLOTS.IN_FEED)
      break

    case 'multiplex':
      el.setAttribute('data-ad-format', 'autorelaxed')
      el.setAttribute('data-ad-slot', SLOTS.MULTIPLEX)
      break
  }
  return el
}

/** Renders the ad by creating the <ins> tag and pushing to AdSense queue. */
async function renderAd() {
  if (isDev) return // Don't render real ads in dev mode
  
  const host = hostRef.value
  if (!host) return
  
  host.innerHTML = '' // Clear previous ad to prevent conflicts
  const ins = buildInsElement()
  host.appendChild(ins)

  try {
    // @ts-ignore
    const q = (window.adsbygoogle = window.adsbygoogle || [])
    q.push({})
  } catch (e) {
    console.error('AdSense failed to push ad:', e)
  }
}

onMounted(async () => {
  await nextTick()
  await ensureScript()
  await renderAd()
})

watch(() => [route.fullPath, props.variant, props.refreshKey], async () => {
  await nextTick()
  // Wait a moment for the page to transition before re-rendering the ad
  setTimeout(renderAd, 100)
})
</script>

<template>
  <div class="flex justify-center my-6">
    <div class="w-full bg-ui-bg-muted dark:bg-ui-bg-elevated border border-dashed border-ui-border-accented dark:border-ui-border-muted rounded-lg p-2 flex justify-center items-center">
      <!-- Development Mode Placeholder -->
      <div v-if="isDev" class="text-center text-ui-text-muted p-4">
        <p class="font-bold">Ad Slot</p>
        <p class="text-sm font-mono">{{ variant }}</p>
      </div>
      <!-- Production Ad Mount Point -->
      <div v-else ref="hostRef" class="w-full min-h-[50px]" />
    </div>
  </div>
</template>