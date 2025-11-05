<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({ name: 'GoogleAd' })

const props = withDefaults(defineProps<{
  /** Layout/type */
  kind?: 'auto' | 'horizontal' | 'leaderboard' | 'vertical' | 'skyscraper' | 'square' | 'multiplex' | 'in-article' | 'in-feed' | 'custom'
  /** Optional clamp for responsive (e.g. "728px"); handled by your CSS via class */
  maxWidth?: string
  /** Only for custom fixed sizes — define matching CSS in main.css */
  width?: string
  height?: string
  /** Change to force re-fill on demand */
  refreshKey?: string | number
  /** Dev */
  adTest?: 'on' | 'off'
  /** Publisher */
  adClient?: string
}>(), {
  kind: 'auto',
  adClient: 'ca-pub-1291242080282540'
})

/** Your real slots mapped to kinds */
const SLOTS: Record<string, { slot: string, format?: string, layout?: string, layoutKey?: string, fullWidth?: boolean }> = {
  auto:        { slot: '8939839370', format: 'auto',        fullWidth: true }, // reuse horizontal
  horizontal:  { slot: '8939839370', format: 'auto',        fullWidth: true },
  leaderboard: { slot: '8939839370', format: 'auto',        fullWidth: true }, // cap via CSS
  vertical:    { slot: '3487917390', format: 'auto',        fullWidth: true },
  skyscraper:  { slot: '3487917390', format: 'auto',        fullWidth: true },
  square:      { slot: '7663977887', format: 'auto',        fullWidth: true },
  multiplex:   { slot: '6808134701', format: 'autorelaxed', fullWidth: true },
  'in-article':{ slot: '6501428979', format: 'fluid',       fullWidth: true, layout: 'in-article' },
  'in-feed':   { slot: '9130894804', format: 'fluid',       fullWidth: true, layoutKey: '-6v+f0-19-44+c6' },
  custom:      { slot: '3375031396', format: 'auto',        fullWidth: false } // style via CSS
}

const hostRef = ref<HTMLElement|null>(null)
const route = useRoute()

/** Load AdSense once (non-async attribute) */
function ensureAdSenseScript(): Promise<void> {
  return new Promise((resolve) => {
    // @ts-ignore
    if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) return resolve()
    const id = 'adsbygoogle-loader'
    let el = document.getElementById(id) as HTMLScriptElement | null
    if (el) {
      el.addEventListener('load', () => resolve())
      setTimeout(() => resolve(), 0)
      return
    }
    el = document.createElement('script')
    el.id = id
    el.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${props.adClient}`
    el.setAttribute('crossorigin', 'anonymous')
    el.addEventListener('load', () => resolve())
    document.head.appendChild(el)
  })
}

function pushFill(retries = 2) {
  // @ts-ignore
  const q = (window.adsbygoogle = window.adsbygoogle || [])
  try { q.push({}) } catch { if (retries > 0) setTimeout(() => pushFill(retries - 1), 350) }
}

async function renderAd() {
  const mount = hostRef.value
  if (!mount) return
  const cfg = SLOTS[props.kind] || SLOTS.auto

  // fresh node each time so Google will (re)fill
  mount.innerHTML = ''

  const ins = document.createElement('ins')
  ins.className = `adsbygoogle ad__ins ad--${props.kind}`

  // data-* required by AdSense
  ins.setAttribute('data-ad-client', props.adClient)
  ins.setAttribute('data-ad-slot', cfg.slot)
  if (cfg.format) ins.setAttribute('data-ad-format', cfg.format)
  if (cfg.fullWidth) ins.setAttribute('data-full-width-responsive', 'true')
  if (cfg.layout) ins.setAttribute('data-ad-layout', cfg.layout)
  if (cfg.layoutKey) ins.setAttribute('data-ad-layout-key', cfg.layoutKey)
  if (props.adTest) ins.setAttribute('data-adtest', props.adTest)

  // Optional hooks for your main.css (no inline styles here)
  if (props.maxWidth) ins.setAttribute('data-maxw', props.maxWidth)
  if (props.width)    ins.setAttribute('data-w', props.width)
  if (props.height)   ins.setAttribute('data-h', props.height)

  mount.appendChild(ins)
  pushFill()
}

onMounted(async () => {
  await nextTick()
  await ensureAdSenseScript()
  // @ts-ignore
  window.adsbygoogle = window.adsbygoogle || []
  renderAd()
})

watch(
  () => [route.fullPath, props.refreshKey, props.kind, props.width, props.height, props.maxWidth],
  async () => { await nextTick(); renderAd() }
)
</script>

<template>
  <!-- Neutral wrapper; style in main.css via .ad, .ad--host, .ad--{kind} -->
  <div class="ad ad--container" :data-kind="kind">
    <div ref="hostRef" class="ad--host"></div>
  </div>
</template>
