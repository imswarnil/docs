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
  /** Force reload when content changes (e.g., on route change) */
  refreshKey?: string | number
}>(), {
  variant: 'leaderboard',
  adClient: 'ca-pub-XXXXXXXXXXXXXXXX' // ⚠️ REPLACE WITH YOUR ADSENSE CLIENT ID
})

/**
 * ⚠️ IMPORTANT: Replace these with your actual slot IDs from your AdSense account.
 * These are just placeholders.
 */
const SLOTS = {
  HORIZONTAL:      '1234567890',
  VERTICAL:        '1234567890',
  SQUARE:          '1234567890',
  IN_ARTICLE:      '1234567890',
  MULTIPLEX:       '1234567890'
} as const

const hostRef = ref<HTMLDivElement|null>(null)
const route = useRoute()

/** Load AdSense script once, ensuring it's ready before ads are pushed. */
function ensureScript(): Promise<void> {
  return new Promise<void>((resolve) => {
    // @ts-ignore
    if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) return resolve()
    
    let s = document.getElementById('adsbygoogle-js') as HTMLScriptElement | null
    if (!s) {
      s = document.createElement('script')
      s.id = 'adsbygoogle-js'
      s.async = false // `false` ensures script loads before q.push({}) runs
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

/** Creates the <ins> element with the correct attributes for the variant. */
function buildInsElement(): HTMLInsElement {
  const el = document.createElement('ins')
  el.className = 'adsbygoogle'
  el.setAttribute('data-ad-client', props.adClient)

  switch (props.variant) {
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
    case 'square':
    case 'square-fixed':
      el.style.cssText = 'display:inline-block;width:250px;height:250px'
      el.setAttribute('data-ad-slot', SLOTS.SQUARE)
      break
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

/** Renders the ad by creating the <ins> tag and pushing to AdSense queue. */
async function renderAd() {
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
  setTimeout(renderAd, 50)
})
</script>

<template>
  <div class="adunit" :data-variant="variant">
    <div class="adunit__frame">
      <div ref="hostRef" class="adunit__mount" />
    </div>
  </div>
</template>