<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'

/**
 * PROPS
 * - kind: choose ad layout
 * - width/height: only for kind="custom"
 * - maxWidth: clamp responsive width (lets main.css handle margins/padding)
 * - refreshKey: force re-render when your page content changes
 * - adTest: 'on' in dev to verify rendering
 */
const props = withDefaults(defineProps<{
  kind?: 'auto' | 'horizontal' | 'leaderboard' | 'vertical' | 'skyscraper' | 'square' | 'in-article' | 'in-feed' | 'multiplex' | 'custom',
  maxWidth?: string,      // e.g. '728px' for leaderboard
  width?: string,         // custom only
  height?: string,        // custom only
  refreshKey?: string | number,
  adTest?: 'on' | 'off'
}>(), {
  kind: 'auto',
  adTest: undefined
})

/**
 * YOUR DEFAULTS (from the slots you pasted)
 */
const AD_CLIENT = 'ca-pub-1291242080282540'
const SLOTS: Record<string, { slot: string, format?: string, layout?: string, layoutKey?: string, fullWidth?: boolean }> = {
  auto:        { slot: '8939839370', format: 'auto', fullWidth: true },      // reuse horizontal slot
  horizontal:  { slot: '8939839370', format: 'auto', fullWidth: true },
  leaderboard: { slot: '8939839370', format: 'auto', fullWidth: true },      // clamp via maxWidth prop
  vertical:    { slot: '3487917390', format: 'auto', fullWidth: true },
  skyscraper:  { slot: '3487917390', format: 'auto', fullWidth: true },      // alias of vertical
  square:      { slot: '7663977887', format: 'auto', fullWidth: true },
  multiplex:   { slot: '6808134701', format: 'autorelaxed', fullWidth: true },
  'in-article':{ slot: '6501428979', format: 'fluid', layout: 'in-article', fullWidth: true },
  'in-feed':   { slot: '9130894804', format: 'fluid', layoutKey: '-6v+f0-19-44+c6', fullWidth: true },
  custom:      { slot: '3375031396', format: 'auto', fullWidth: false }      // you will pass width/height
}

const route = useRoute()
const hostRef = ref<HTMLElement | null>(null)

/**
 * Load AdSense script ONCE, without async.
 * If it's already present, reuse it.
 */
function ensureAdSenseScript(): Promise<void> {
  return new Promise((resolve) => {
    // @ts-ignore
    if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) return resolve()

    const id = 'adsbygoogle-non-async'
    const existing = document.getElementById(id) as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener('load', () => resolve())
      // fallback resolve if it’s already loaded
      setTimeout(() => resolve(), 0)
      return
    }

    const s = document.createElement('script')
    s.id = id
    s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`
    s.setAttribute('crossorigin', 'anonymous')
    // IMPORTANT: no async attribute (per your request)
    s.addEventListener('load', () => resolve())
    document.head.appendChild(s)
  })
}

/**
 * Render the ad: clear previous <ins>, create a new one, push queue.
 */
async function renderAd() {
  const el = hostRef.value
  if (!el) return

  const cfg = SLOTS[props.kind] || SLOTS.auto

  // clear previous
  el.innerHTML = ''

  const ins = document.createElement('ins')
  ins.className = 'adsbygoogle ad__frame'

  // style: width 100%, clamp if provided; height via Google (auto/fluid) or your custom size
  const styleParts = ['display:block', 'width:100%']
  if (props.maxWidth) styleParts.push(`max-width:${props.maxWidth}`)
  if (props.kind === 'custom' && props.width && props.height) {
    styleParts.push(`width:${props.width}`)
    styleParts.push(`height:${props.height}`)
  }
  ins.setAttribute('style', styleParts.join(';'))

  // required data-* attrs
  ins.setAttribute('data-ad-client', AD_CLIENT)
  ins.setAttribute('data-ad-slot', cfg.slot)
  if (cfg.format) ins.setAttribute('data-ad-format', cfg.format)
  if (cfg.fullWidth) ins.setAttribute('data-full-width-responsive', 'true')
  if (cfg.layout) ins.setAttribute('data-ad-layout', cfg.layout)
  if (cfg.layoutKey) ins.setAttribute('data-ad-layout-key', cfg.layoutKey)
  if (props.adTest) ins.setAttribute('data-adtest', props.adTest)

  el.appendChild(ins)

  // @ts-ignore
  const q = (window.adsbygoogle = window.adsbygoogle || [])
  try { q.push({}) } catch {}
}

onMounted(async () => {
  await nextTick()
  await ensureAdSenseScript()
  // @ts-ignore
  window.adsbygoogle = window.adsbygoogle || []
  renderAd()
})

// Re-fill when navigating or when refreshKey/kind changes
watch(() => [route.fullPath, props.refreshKey, props.kind], async () => {
  await nextTick()
  renderAd()
})
</script>

<template>
  <!-- Keep structure minimal; style in your main.css via .ad classes -->
  <aside
    class="ad ad--container"
    :class="`ad--${kind}`"
    role="complementary"
    aria-label="Advertisement"
  >
    <div ref="hostRef" class="ad--host"></div>
  </aside>
</template>

<style scoped>
/* Minimal safety styles. Put real spacing/skins in main.css to match your site */
.ad--container {
  display: block;
}
.ad--host {
  /* leave layout to the <ins> we inject; this ensures wrapper respects margins/padding from your main.css */
}
</style>
