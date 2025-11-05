<script setup lang="ts">
import { onMounted, ref, watch, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'

type Kind =
  | 'auto' | 'horizontal' | 'vertical' | 'square' | 'leaderboard' | 'skyscraper'
  | 'in-article' | 'in-feed' | 'multiplex' | 'custom'

const props = withDefaults(defineProps<{
  adClient?: string
  kind?: Kind
  /** Slot ids for each kind (defaults are your real slots) */
  slots?: Partial<Record<Kind, string>>
  /** For in-feed (fluid) */
  inFeedLayoutKey?: string
  /** For custom fixed sizes */
  width?: string
  height?: string
  /** Cap placeholder width */
  maxWidth?: string
  /** Force re-render key */
  refreshKey?: string | number
  /** Dev only: 'on' to test */
  adTest?: 'on' | 'off'
  /** Labels */
  label?: string
  badge?: string
  heading?: string
}>(), {
  adClient: 'ca-pub-1291242080282540',
  kind: 'auto',
  // 👉 Your defaults baked in (no need to pass anything)
  slots: {
    horizontal:  '8939839370', // Responsive horizontal
    leaderboard: '8939839370', // Use same responsive slot at wide widths
    vertical:    '3487917390', // Responsive vertical
    skyscraper:  '3487917390', // Map to vertical
    square:      '7663977887', // Responsive square
    multiplex:   '6808134701', // Auto-relaxed
    custom:      '3375031396', // Fixed-size multiplex
    'in-feed':   '9130894804', // Fluid in-feed
    'in-article':'6501428979'  // Fluid in-article
  },
  inFeedLayoutKey: '-6v+f0-19-44+c6',
  label: 'Advertisement',
  badge: 'Ad',
  heading: 'Sponsored content'
})

const route = useRoute()
const hostRef = ref<HTMLElement | null>(null)
const mountRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const isFilled = ref(false)
const containerWidth = ref(0)

/** Auto decide when kind='auto' */
const autoKind = computed<Kind>(() => {
  const w = containerWidth.value
  if (w >= 728) return 'leaderboard'
  if (w >= 468) return 'horizontal'
  if (w >= 300) return 'square'
  return 'vertical'
})

const resolvedKind = computed<Kind>(() => props.kind === 'auto' ? autoKind.value : props.kind)
const slotId = computed(() => props.slots?.[resolvedKind.value])

/** Build AdSense attributes for the chosen kind */
const adAttrs = computed(() => {
  const k = resolvedKind.value
  const attrs: Record<string, string> = {
    style: 'display:block',
    'data-ad-client': props.adClient!
  }

  if (k === 'in-article') {
    attrs['data-ad-format'] = 'fluid'
    attrs['data-ad-layout'] = 'in-article'
    if (slotId.value) attrs['data-ad-slot'] = slotId.value
    return attrs
  }

  if (k === 'in-feed') {
    attrs['data-ad-format'] = 'fluid'
    if (props.inFeedLayoutKey) attrs['data-ad-layout-key'] = props.inFeedLayoutKey
    if (slotId.value) attrs['data-ad-slot'] = slotId.value
    return attrs
  }

  if (k === 'multiplex') {
    attrs['data-ad-format'] = 'autorelaxed'
    if (slotId.value) attrs['data-ad-slot'] = slotId.value
    return attrs
  }

  if (k === 'custom') {
    const w = props.width ?? '900px'
    const h = props.height ?? '250px'
    attrs.style = `display:inline-block;width:${w};height:${h};`
    if (slotId.value) attrs['data-ad-slot'] = slotId.value
    return attrs
  }

  // Responsive display ads
  attrs['data-ad-format'] = 'auto'
  attrs['data-full-width-responsive'] = 'true'
  if (slotId.value) attrs['data-ad-slot'] = slotId.value
  return attrs
})

/** Placeholder (CLS-friendly) */
const frameStyle = computed(() => {
  const k = resolvedKind.value
  if (k === 'custom' && props.width && props.height) {
    return { width: props.width, height: props.height }
  }

  let maxW = 320
  let ratio = 300 / 250

  if (k === 'leaderboard') { maxW = 728; ratio = 728 / 90 }
  else if (k === 'horizontal') { maxW = 728; ratio = 300 / 250 }
  else if (k === 'square') { maxW = 300; ratio = 1 / 1 }
  else if (k === 'skyscraper' || k === 'vertical') { maxW = 300; ratio = 300 / 600 }
  else if (k === 'in-article') { maxW = 700; ratio = 16 / 9 }
  else if (k === 'in-feed') { maxW = 700; ratio = 5 / 3 }
  else if (k === 'multiplex') { maxW = 700; ratio = 16 / 9 }

  if (props.maxWidth) {
    const mw = Number(String(props.maxWidth).replace('px',''))
    if (Number.isFinite(mw)) maxW = mw
  }

  return { width: '100%', maxWidth: `${maxW}px`, aspectRatio: `${ratio}` } as Record<string, string>
})

function setupObservers() {
  const host = hostRef.value
  if (!host) return

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        isVisible.value = true
        io.disconnect()
      }
    })
  }, { rootMargin: '200px 0px' })
  io.observe(host)

  const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const w = Math.floor(entry.contentRect.width)
      if (w !== containerWidth.value) containerWidth.value = w
    }
  })
  ro.observe(host)
}

async function renderAd () {
  const el = mountRef.value
  if (!el || !slotId.value) return
  el.innerHTML = ''
  isFilled.value = false

  const ins = document.createElement('ins')
  ins.className = 'adsbygoogle'
  for (const [k, v] of Object.entries(adAttrs.value)) ins.setAttribute(k, v as string)
  if (props.adTest) ins.setAttribute('data-adtest', props.adTest)
  el.appendChild(ins)

  // @ts-ignore
  const q = (window.adsbygoogle = window.adsbygoogle || [])
  try { q.push({}) } catch {}
  requestAnimationFrame(() => { isFilled.value = true })
}

onMounted(async () => {
  await nextTick()
  // @ts-ignore
  window.adsbygoogle = window.adsbygoogle || []
  setupObservers()
  const stop = watch(isVisible, (v) => { if (v) { renderAd(); stop() } })
})

watch(
  () => [route.fullPath, resolvedKind.value, slotId.value, props.refreshKey],
  async () => { if (!isVisible.value) return; await nextTick(); renderAd() }
)
</script>

<template>
  <aside class="gad" role="complementary" :aria-label="label" ref="hostRef">
    <h2 class="sr-only">{{ heading }}</h2>
    <span class="gad__badge">{{ badge }}</span>

    <div class="gad__frame" :style="frameStyle">
      <div class="gad__skeleton" v-show="!isFilled" aria-hidden="true">
        <div class="gad__rows">
          <div class="gad__row gad__row--title" />
          <div class="gad__row" />
          <div class="gad__row" />
          <div class="gad__btn" />
        </div>
      </div>
      <div ref="mountRef" class="gad__mount" />
    </div>

    <p class="gad__caption">{{ label }}</p>
  </aside>
</template>

<style scoped>
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}
.gad{position:relative;display:grid;gap:8px;justify-items:center;font-size:12px;color:rgba(0,0,0,.6);}
:where(html.dark) .gad{color:rgba(255,255,255,.7);}
.gad__badge{position:absolute;top:-8px;left:8px;font-size:11px;padding:2px 6px;border-radius:999px;background:color-mix(in srgb, var(--ui-border, #e5e7eb) 60%, transparent);backdrop-filter:blur(2px);}
.gad__frame{display:flex;align-items:center;justify-content:center;width:100%;border:1px dashed var(--ui-border, #e5e7eb);border-radius:12px;background:
  radial-gradient(ellipse at top left, color-mix(in srgb, var(--ui-bg, #fff) 70%, transparent), transparent 60%),
  radial-gradient(ellipse at bottom right, color-mix(in srgb, var(--ui-bg, #fff) 70%, transparent), transparent 60%);
overflow:hidden;contain:paint;position:relative;}
.gad__mount{display:flex;align-items:center;justify-content:center;width:100%;height:100%;}
.gad__skeleton{position:absolute;inset:6px;border-radius:10px;background:linear-gradient(100deg, rgba(0,0,0,0.06) 20%, rgba(0,0,0,0.10) 40%, rgba(0,0,0,0.06) 60%);background-size:200% 100%;animation:gad-shimmer 1.6s infinite linear;z-index:1;}
:where(html.dark) .gad__skeleton{background:linear-gradient(100deg, rgba(255,255,255,0.08) 20%, rgba(255,255,255,0.14) 40%, rgba(255,255,255,0.08) 60%);}
@keyframes gad-shimmer{0%{background-position:200% 0;}100%{background-position:0 0;}}
.gad__rows{width:100%;height:100%;padding:12px;display:grid;grid-template-rows:auto auto auto 1fr;gap:8px;}
.gad__row{height:10px;border-radius:6px;background:color-mix(in srgb, currentColor 16%, transparent);}
.gad__row--title{height:14px;width:70%;}
.gad__btn{align-self:end;justify-self:start;width:96px;height:26px;border-radius:8px;background:color-mix(in srgb, currentColor 22%, transparent);}
.gad__caption{margin:0;opacity:.7;}
@container (max-width: 320px){ .gad__frame{ max-width:100% !important; } }
</style>
