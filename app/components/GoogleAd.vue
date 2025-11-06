<script setup lang="ts">
import { onMounted, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({ name: 'GoogleAd' })

type Variant =
  | 'horizontal' | 'vertical' | 'square' | 'square-fixed'
  | 'leaderboard' | 'skyscraper'
  | 'in-article' | 'in-feed' | 'multiplex'
  | 'fixed'

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
  maxW?: string
  maxH?: string
  minH?: string
}>(), {
  variant: 'horizontal',
  adClient: 'ca-pub-1291242080282540'
})

const route = useRoute()
const hostRef = ref<HTMLDivElement | null>(null)

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

    case 'square-fixed':
      a['data-ad-slot'] = props.adSlot || '7663977887'
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

    case 'multiplex':
      a['data-ad-slot'] = props.adSlot || '6808134701'
      a['data-ad-format'] = 'autorelaxed'
      break

    case 'fixed':
      a['data-ad-slot'] = props.adSlot || '8939839370'
      break
  }

  if (props.adTest) a['data-adtest'] = props.adTest
  return a
}

function insStyleForVariant() {
  if (props.variant === 'fixed') {
    const w = props.width  || '728px'
    const h = props.height || '90px'
    return `display:block !important;width:${w};height:${h}`
  }
  if (props.variant === 'square-fixed') {
    return 'display:block !important;width:250px;height:250px'
  }
  // responsive
  return 'display:block !important'
}

async function renderAd() {
  const host = hostRef.value
  if (!host) return
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
  () => [route.fullPath, props.refreshKey, props.variant, props.width, props.height, props.adSlot],
  async () => {
    await nextTick()
    await renderAd()
  }
)
</script>

<template>
  <div
    :class="['adbox', `adbox--${variant}`, dataClass]"
    :style="{
      '--ad-max-w': maxW || '100%',
      '--ad-max-h': maxH || 'none',
      '--ad-min-h': minH || '0px'
    }"
  >
    <div class="adbox__frame">
      <div ref="hostRef" class="adbox__mount" />
    </div>
  </div>
</template>
