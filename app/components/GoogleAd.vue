<script setup lang="ts">
import { onMounted, nextTick, watch, ref } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({ name: 'GoogleAd' })

type Variant =
  | 'horizontal'      // responsive (auto)
  | 'vertical'        // responsive (auto)
  | 'square'          // responsive (auto)
  | 'leaderboard'     // responsive (auto)
  | 'skyscraper'      // responsive (auto)
  | 'multiplex'       // autorelaxed
  | 'multiplex-fixed' // fixed 900x250 (your code)
  | 'in-article'      // fluid + layout in-article
  | 'in-feed'         // fluid + layout-key
  | 'fixed'           // fixed WxH

const props = withDefaults(defineProps<{
  variant?: Variant
  adClient?: string
  adSlot?: string
  adLayout?: string
  adLayoutKey?: string
  adTest?: 'on' | 'off'
  width?: string
  height?: string
  refreshKey?: string | number
  dataClass?: string
}>(), {
  variant: 'horizontal',
  adClient: 'ca-pub-1291242080282540'
})

const route = useRoute()
const mountRef = ref<HTMLDivElement | null>(null)

/** Load AdSense script (non-async per your ask) and resolve when ready-ish */
function ensureScript(): Promise<void> {
  return new Promise<void>((resolve) => {
    // @ts-ignore
    if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) return resolve()

    let s = document.getElementById('adsbygoogle-js') as HTMLScriptElement | null
    if (!s) {
      s = document.createElement('script')
      s.id = 'adsbygoogle-js'
      s.async = false            // you asked to avoid async
      s.crossOrigin = 'anonymous'
      s.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${props.adClient}`
      document.head.appendChild(s)
      s.addEventListener('load', () => resolve())
      s.addEventListener('error', () => resolve())
    } else {
      return resolve()
    }
  })
}

function attrsForVariant() {
  const a: Record<string, string> = { 'data-ad-client': props.adClient! }

  switch (props.variant) {
    case 'horizontal':
    case 'leaderboard':
      a['data-ad-slot'] = props.adSlot || '8939839370'
      a['data-ad-format'] = 'auto'
      a['data-full-width-responsive'] = 'true'
      break

    case 'vertical':
    case 'skyscraper':
      a['data-ad-slot'] = props.adSlot || '3487917390'
      a['data-ad-format'] = 'auto'
      a['data-full-width-responsive'] = 'true'
      break

    case 'square':
      a['data-ad-slot'] = props.adSlot || '7663977887'
      a['data-ad-format'] = 'auto'
      a['data-full-width-responsive'] = 'true'
      break

    case 'multiplex':
      a['data-ad-slot'] = props.adSlot || '6808134701'
      a['data-ad-format'] = 'autorelaxed'
      break

    case 'multiplex-fixed':
      a['data-ad-slot'] = props.adSlot || '3375031396'
      break

    case 'in-article':
      a['data-ad-slot'] = props.adSlot || '6501428979'
      a['data-ad-layout'] = props.adLayout || 'in-article'
      a['data-ad-format'] = 'fluid'
      break

    case 'in-feed':
      a['data-ad-slot'] = props.adSlot || '9130894804'
      a['data-ad-format'] = 'fluid'
      a['data-ad-layout-key'] = props.adLayoutKey || '-6v+f0-19-44+c6'
      break

    case 'fixed':
      a['data-ad-slot'] = props.adSlot || '8939839370'
      break
  }

  if (props.adTest) a['data-adtest'] = props.adTest
  return a
}

function insStyleForVariant() {
  if (props.variant === 'fixed' || props.variant === 'multiplex-fixed') {
    const w = props.width  || (props.variant === 'multiplex-fixed' ? '900px' : '728px')
    const h = props.height || (props.variant === 'multiplex-fixed' ? '250px' : '90px')
    return `display:inline-block;width:${w};height:${h}`
  }
  return 'display:block'
}

async function renderAd() {
  const host = mountRef.value
  if (!host) return

  // Clear previous fill
  host.innerHTML = ''

  const ins = document.createElement('ins')
  ins.className = 'adsbygoogle'
  ins.setAttribute('style', insStyleForVariant())

  const attrs = attrsForVariant()
  Object.entries(attrs).forEach(([k, v]) => ins.setAttribute(k, v))
  host.appendChild(ins)

  // @ts-ignore
  const q = (window.adsbygoogle = window.adsbygoogle || [])
  try { q.push({}) } catch {}
}

onMounted(async () => {
  await nextTick()
  await ensureScript()
  await renderAd()
})

watch(
  () => [route.fullPath, props.refreshKey, props.variant, props.adSlot, props.width, props.height],
  async () => {
    await nextTick()
    await renderAd()
  }
)
</script>

<template>
  <div :class="['gads', `gads--${variant}`, dataClass]" role="none">
    <div ref="mountRef" class="gads__frame"></div>
  </div>
</template>
