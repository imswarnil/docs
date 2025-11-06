<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({ name: 'GoogleAd' })

type Variant =
  | 'leaderboard'        // 728×90 (responsive-friendly)
  | 'large-leaderboard'  // 970×90
  | 'small-leaderboard'  // 320×50
  | 'square'             // 250×250 (clamped)
  | 'wide-skyscraper'    // 300×600
  | 'skyscraper'         // 160×600
  | 'rectangle'          // 300×250 (MREC)
  | 'horizontal'         // responsive auto (fallback)
  | 'vertical'           // responsive auto (fallback)

const props = withDefaults(defineProps<{
  variant?: Variant
  adClient?: string
  /** Optional: force reload when content changes */
  refreshKey?: string | number
}>(), {
  variant: 'leaderboard',
  adClient: 'ca-pub-1291242080282540'
})

/** Default slots you already shared. No asking, just ship. */
const SLOTS = {
  HORIZONTAL:      '8939839370', // responsive horizontal
  VERTICAL:        '3487917390', // responsive vertical
  SQUARE:          '7663977887', // responsive square (we clamp to 250)
  IN_ARTICLE:      '6501428979', // not used here
  IN_FEED:         '9130894804', // not used here
  MULTIPLEX:       '6808134701'  // not used here
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
      s.async = false
      s.crossOrigin = 'anonymous'
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${props.adClient}`
      document.head.appendChild(s)
      s.addEventListener('load', () => resolve())
      s.addEventListener('error', () => resolve())
    } else {
      resolve()
    }
  })
}

/** Choose attributes & inline size for each preset */
function buildIns(): HTMLInsElement {
  const el = document.createElement('ins')
  el.className = 'adsbygoogle'

  // Common
  el.setAttribute('data-ad-client', props.adClient)

  // Variant map
  switch (props.variant) {
    // Fixed sizes (explicit width/height)
    case 'large-leaderboard': // 970×90
      el.style.cssText = 'display:inline-block;width:970px;height:90px'
      el.setAttribute('data-ad-slot', SLOTS.HORIZONTAL)
      break

    case 'leaderboard': // 728×90 (use fixed box for crispness)
      el.style.cssText = 'display:inline-block;width:728px;height:90px'
      el.setAttribute('data-ad-slot', SLOTS.HORIZONTAL)
      break

    case 'small-leaderboard': // 320×50
      el.style.cssText = 'display:inline-block;width:320px;height:50px'
      el.setAttribute('data-ad-slot', SLOTS.HORIZONTAL)
      break

    case 'wide-skyscraper': // 300×600
      el.style.cssText = 'display:inline-block;width:300px;height:600px'
      el.setAttribute('data-ad-slot', SLOTS.VERTICAL)
      break

    case 'skyscraper': // 160×600
      el.style.cssText = 'display:inline-block;width:160px;height:600px'
      el.setAttribute('data-ad-slot', SLOTS.VERTICAL)
      break

    case 'rectangle': // 300×250 (MREC)
      el.style.cssText = 'display:inline-block;width:300px;height:250px'
      el.setAttribute('data-ad-slot', SLOTS.HORIZONTAL)
      break

    case 'square': // clamp to 250×250 (uses square slot)
      el.style.cssText = 'display:inline-block;width:250px;height:250px'
      el.setAttribute('data-ad-slot', SLOTS.SQUARE)
      break

    // Responsive fallbacks (auto)
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
  host.innerHTML = ''

  const ins = buildIns()
  host.appendChild(ins)

  // @ts-ignore
  const q = (window.adsbygoogle = window.adsbygoogle || [])
  try { q.push({}) } catch {}
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
  <!-- Wrapper only adds the dashed border & keeps ad centered -->
  <div class="adunit" :data-variant="variant">
    <div class="adunit__frame">
      <div ref="hostRef" class="adunit__mount" />
    </div>
  </div>
</template>
