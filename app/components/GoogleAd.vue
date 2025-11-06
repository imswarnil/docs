<!-- components/GoogleAd.vue -->
<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({ name: 'GoogleAd' })

type Variant =
  | 'leaderboard'        // 728×90
  | 'large-leaderboard'  // 970×90
  | 'small-leaderboard'  // 320×50
  | 'square'             // Responsive square, clamped at 250px
  | 'square-fixed'       // Strict 250×250
  | 'wide-skyscraper'    // 300×600
  | 'skyscraper'         // 160×600
  | 'rectangle'          // 300×250 (MREC)
  | 'horizontal'         // Responsive auto
  | 'vertical'           // Responsive auto
  | 'in-article'         // Responsive in-article (fluid)
  | 'multiplex'          // Responsive matched content (autorelaxed)

const props = withDefaults(defineProps<{
  variant?: Variant
  adClient?: string
  /** Optional: force reload when content changes */
  refreshKey?: string | number
}>(), {
  variant: 'leaderboard',
  adClient: 'ca-pub-1291242080282540' // Replace with your AdSense Client ID
})

/**
 * Your AdSense Slot IDs.
 * Replace these with your actual slot IDs from your AdSense account.
 */
const SLOTS = {
  HORIZONTAL:      '8939839370',
  VERTICAL:        '3487917390',
  SQUARE:          '7663977887',
  IN_ARTICLE:      '6501428979',
  MULTIPLEX:       '6808134701'
} as const

const hostRef = ref<HTMLDivElement|null>(null)
const route = useRoute()

/** Load AdSense (non-async attribute) once */
function ensureScript(): Promise<void> {
  return new Promise<void>((resolve) => {
    // @ts-ignore
    if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) return resolve()
    let s = document.getElementById('adsbygoogle-js') as HTMLScriptElement | null
    if (!s) {
      s = document.createElement('script')
      s.id = 'adsbygoogle-js'
      s.async = false // Using `async=false` to ensure it loads before ads are pushed
      s.crossOrigin = 'anonymous'
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${props.adClient}`
      document.head.appendChild(s)
      s.addEventListener('load', () => resolve())
      s.addEventListener('error', () => resolve()) // Resolve on error to not block page
    } else {
      resolve()
    }
  })
}

/** Choose attributes & inline size for each preset */
function buildIns(): HTMLInsElement {
  const el = document.createElement('ins')
  el.className = 'adsbygoogle'
  el.setAttribute('data-ad-client', props.adClient)

  switch (props.variant) {
    // Fixed sizes (explicit width/height)
    case 'large-leaderboard':
      el.style.cssText = 'display:inline-block;width:970px;height:90px'
      el.setAttribute('data-ad-slot', SLOTS.HORIZONTAL)
      break
    case 'leaderboard':
      el.style.cssText = 'display:inline-block;width:728px;height:90px'
      el.setAttribute('data-ad-slot', SLOTS.HORIZONTAL)
      break
    case 'small-leaderboard':
      el.style.cssText = 'display:inline-block;width:320px;height:50px'
      el.setAttribute('data-ad-slot', SLOTS.HORIZONTAL)
      break
    case 'wide-skyscraper':
      el.style.cssText = 'display:inline-block;width:300px;height:600px'
      el.setAttribute('data-ad-slot', SLOTS.VERTICAL)
      break
    case 'skyscraper':
      el.style.cssText = 'display:inline-block;width:160px;height:600px'
      el.setAttribute('data-ad-slot', SLOTS.VERTICAL)
      break
    case 'rectangle':
      el.style.cssText = 'display:inline-block;width:300px;height:250px'
      el.setAttribute('data-ad-slot', SLOTS.HORIZONTAL)
      break
    case 'square': // Responsive square, clamped by CSS
    case 'square-fixed': // Strict 250x250
      el.style.cssText = 'display:inline-block;width:250px;height:250px'
      el.setAttribute('data-ad-slot', SLOTS.SQUARE)
      break

    // Fluid / Responsive formats
    case 'in-article':
      el.style.cssText = 'display:block; text-align:center;'
      el.setAttribute('data-ad-layout', 'in-article')
      el.setAttribute('data-ad-format', 'fluid')
      el.setAttribute('data-ad-slot', SLOTS.IN_ARTICLE)
      break
    case 'multiplex':
      el.style.cssText = 'display:block;'
      el.setAttribute('data-ad-format', 'autorelaxed')
      el.setAttribute('data-ad-slot', SLOTS.MULTIPLEX)
      break
    case 'horizontal':
      el.style.cssText = 'display:block'
      el.setAttribute('data-ad-slot', SLOTS.HORIZONTAL)
      el.setAttribute('data-ad-format', 'auto')
      el.setAttribute('data-full-width-responsive', 'true')
      break
    case 'vertical':
      el.style.cssText = 'display:block'
      el.setAttribute('data-ad-slot', SLOTS.VERTICAL)
      el.setAttribute('data-ad-format', 'auto')
      el.setAttribute('data-full-width-responsive', 'true')
      break
  }

  return el
}

async function render() {
  const host = hostRef.value
  if (!host) return
  host.innerHTML = '' // Clear previous ad

  const ins = buildIns()
  host.appendChild(ins)

  try {
    // @ts-ignore
    const q = (window.adsbygoogle = window.adsbygoogle || [])
    q.push({})
  }
  catch (e) {
    console.error('AdSense push error:', e)
  }
}

onMounted(async () => {
  await nextTick()
  await ensureScript()
  await render()
})

watch(() => [route.fullPath, props.variant, props.refreshKey], async () => {
  await nextTick()
  await render()
})
</script>

<template>
  <div class="adunit" :data-variant="variant">
    <div class="adunit__frame">
      <div ref="hostRef" class="adunit__mount" />
    </div>
  </div>
</template>