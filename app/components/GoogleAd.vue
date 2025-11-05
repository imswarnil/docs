<script setup lang="ts">
import { onMounted, ref, watch, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({ name: 'GoogleAd' })

/**
 * Variants supported (with your defaults):
 * - horizontal (resp)  -> slot 8939839370
 * - vertical   (resp)  -> slot 3487917390
 * - square     (resp)  -> slot 7663977887
 * - multiplex  (auto-relaxed) -> slot 6808134701
 * - in-article (fluid) -> slot 6501428979
 * - in-feed    (fluid, layout-key) -> slot 9130894804
 * - fixed      (explicit width/height; defaults to 728x90 if none)
 *
 * You can override any default with adSlot / width / height / etc.
 */

type Variant =
  | 'horizontal'
  | 'vertical'
  | 'square'
  | 'multiplex'
  | 'in-article'
  | 'in-feed'
  | 'fixed'

const props = withDefaults(defineProps<{
  variant?: Variant
  adClient?: string
  adSlot?: string
  adLayout?: string
  adLayoutKey?: string
  adTest?: 'on' | 'off'
  width?: string      // only for fixed (e.g. "300px")
  height?: string     // only for fixed (e.g. "600px")
  refreshKey?: string | number
  dataClass?: string  // optional extra class on wrapper
}>(), {
  variant: 'horizontal',
  adClient: 'ca-pub-1291242080282540',
  adTest: undefined,
  width: undefined,
  height: undefined,
  dataClass: ''
})

const route = useRoute()
const mountRef = ref<HTMLDivElement | null>(null)

/** Ensure AdSense script exists and is ready */
function ensureAdsScript(): Promise<void> {
  return new Promise<void>((resolve) => {
    // Already present?
    // @ts-ignore
    if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) return resolve()

    // Check existing <script> tag
    const id = 'adsbygoogle-js'
    let tag = document.getElementById(id) as HTMLScriptElement | null
    if (!tag) {
      tag = document.createElement('script')
      tag.id = id
      tag.async = true
      tag.crossOrigin = 'anonymous'
      tag.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${props.adClient}`
      document.head.appendChild(tag)
    }

    // Wait until the queue is ready
    const start = Date.now()
    const wait = () => {
      // @ts-ignore
      if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) return resolve()
      if (Date.now() - start > 8000) return resolve() // soft-timeout; let push() try anyway
      requestAnimationFrame(wait)
    }
    wait()
  })
}

/** Default mapping from variant -> attributes */
const resolved = computed(() => {
  const base: Record<string, string> = {
    'data-ad-client': props.adClient!,
  }

  // Defaults from your provided codes
  switch (props.variant) {
    case 'horizontal': {
      base['data-ad-slot'] = props.adSlot || '8939839370'
      base['data-ad-format'] = 'auto'
      base['data-full-width-responsive'] = 'true'
      break
    }
    case 'vertical': {
      base['data-ad-slot'] = props.adSlot || '3487917390'
      base['data-ad-format'] = 'auto'
      base['data-full-width-responsive'] = 'true'
      break
    }
    case 'square': {
      base['data-ad-slot'] = props.adSlot || '7663977887'
      base['data-ad-format'] = 'auto'
      base['data-full-width-responsive'] = 'true'
      break
    }
    case 'multiplex': {
      // Autorelaxed
      base['data-ad-slot'] = props.adSlot || '6808134701'
      base['data-ad-format'] = 'autorelaxed'
      break
    }
    case 'in-article': {
      base['data-ad-slot'] = props.adSlot || '6501428979'
      base['data-ad-layout'] = props.adLayout || 'in-article'
      base['data-ad-format'] = 'fluid'
      break
    }
    case 'in-feed': {
      base['data-ad-slot'] = props.adSlot || '9130894804'
      base['data-ad-format'] = 'fluid'
      base['data-ad-layout-key'] = props.adLayoutKey || '-6v+f0-19-44+c6'
      break
    }
    case 'fixed': {
      // Use explicit width/height
      base['data-ad-slot'] = props.adSlot || '8939839370'
      break
    }
  }

  if (props.adTest) base['data-adtest'] = props.adTest

  // style for <ins>
  const style =
    props.variant === 'fixed'
      ? `display:inline-block;${props.width ? `width:${props.width};` : 'width:728px;'}${props.height ? `height:${props.height};` : 'height:90px;'}`
      : 'display:block'

  return { attrs: base, style }
})

/** Render or re-render the ad */
async function renderAd() {
  const host = mountRef.value
  if (!host) return

  // Clean previous content to avoid "already filled" errors
  host.innerHTML = ''

  const ins = document.createElement('ins')
  ins.className = 'adsbygoogle'
  ins.setAttribute('style', resolved.value.style)

  // Apply attributes
  Object.entries(resolved.value.attrs).forEach(([k, v]) => {
    if (v != null && v !== '') ins.setAttribute(k, v)
  })

  host.appendChild(ins)

  // Push to queue
  // @ts-ignore
  const q = (window.adsbygoogle = window.adsbygoogle || [])
  try { q.push({}) } catch { /* ignore */ }
}

onMounted(async () => {
  await nextTick()
  await ensureAdsScript()
  await renderAd()
})

// Re-render on route change or external refreshKey
watch(
  () => [route.fullPath, props.refreshKey, props.variant, props.adSlot, props.width, props.height],
  async () => {
    await nextTick()
    await renderAd()
  }
)
</script>

<template>
  <!-- Wrapper: style in main.css -->
  <div
    class="gads"
    :class="['gads--' + variant, dataClass]"
    role="none"
  >
    <div ref="mountRef" class="gads__frame" />
  </div>
</template>
