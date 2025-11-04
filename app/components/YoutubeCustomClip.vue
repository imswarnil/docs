<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

type TimeLike = number | string

const props = withDefaults(defineProps<{
  videoId: string
  /** Start of the clip (ss | mm:ss | hh:mm:ss | number) */
  start?: TimeLike
  /** End of the clip (same formats). If omitted, uses full video duration. */
  end?: TimeLike
  /** Autoplay after ready (muted by default for autoplay compatibility) */
  autoplay?: boolean
  muted?: boolean
  /** Initial volume (0..1). Will apply after user interaction if browser blocks it. */
  initialVolume?: number
  /** Aspect ratio of frame */
  ratio?: string
  /** Accessible label */
  title?: string
  /** Show a completion overlay when clip ends */
  showCompleteOverlay?: boolean
  completeTitle?: string
  completeDescription?: string
}>(), {
  start: 0,
  end: undefined,
  autoplay: true,
  muted: true,
  initialVolume: 0.7,
  ratio: '16/9',
  title: 'Video clip',
  showCompleteOverlay: true,
  completeTitle: 'Video completed',
  completeDescription: 'Nice. That’s a wrap!'
})

/* ---------- Utils ---------- */
function toSeconds(v?: TimeLike): number | undefined {
  if (v === undefined || v === null || v === '') return undefined
  if (typeof v === 'number') return Math.max(0, Math.floor(v))
  const parts = String(v).split(':').map(n => Number(n))
  if (parts.some(isNaN)) return undefined
  let s = 0
  if (parts.length === 1) s = parts[0]
  if (parts.length === 2) s = parts[0] * 60 + parts[1]
  if (parts.length === 3) s = parts[0] * 3600 + parts[1] * 60 + parts[2]
  return Math.max(0, Math.floor(s))
}
function fmt(t: number) {
  t = Math.max(0, Math.floor(t))
  const h = Math.floor(t / 3600)
  const m = Math.floor((t % 3600) / 60)
  const s = t % 60
  return h > 0 ? `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
               : `${m}:${String(s).padStart(2,'0')}`
}

/* ---------- State ---------- */
const startSec = ref<number>(toSeconds(props.start) ?? 0)
const endSec = ref<number | undefined>(toSeconds(props.end))
const duration = ref<number>(0)                  // full video duration
const current = ref<number>(startSec.value)      // absolute seconds (video space)
const playing = ref<boolean>(false)
const completed = ref<boolean>(false)
const volume = ref<number>(Math.max(0, Math.min(1, props.initialVolume)))
const muted = ref<boolean>(!!props.muted)

const clipLen = computed(() => {
  const endV = endSec.value ?? (duration.value || 0)
  return Math.max(0, endV - startSec.value)
})
const clipPos = computed(() => Math.max(0, Math.min(clipLen.value, current.value - startSec.value)))

/* ---------- Player ---------- */
const hostRef = ref<HTMLDivElement | null>(null)
let player: any = null
let tick: any = null

function loadYT(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  const w = window as any
  if (w.YT?.Player) return Promise.resolve()
  if (w.__ytReady) return w.__ytReady
  w.__ytReady = new Promise<void>((resolve) => {
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(tag)
    ;(window as any).onYouTubeIframeAPIReady = () => resolve()
  })
  return w.__ytReady
}

function createPlayer() {
  if (!hostRef.value) return
  const YT = (window as any).YT
  player = new YT.Player(hostRef.value, {
    videoId: props.videoId,
    width: '100%',
    height: '100%',
    playerVars: {
      controls: 0,            // hide all native controls
      rel: 0,
      modestbranding: 1,
      fs: 0,
      disablekb: 1,
      iv_load_policy: 3,
      playsinline: 1,
      start: startSec.value,
      ...(endSec.value ? { end: endSec.value } : {}),
      autoplay: props.autoplay ? 1 : 0,
      enablejsapi: 1,
      origin: location.origin
    },
    events: {
      onReady: (e: any) => {
        duration.value = Math.floor(e.target.getDuration?.() || 0)
        if (!endSec.value && duration.value) endSec.value = duration.value
        seekTo(startSec.value, false)
        setMuted(muted.value)
        // Volume set will only stick after user gesture in some browsers.
        try { e.target.setVolume?.(Math.round(volume.value * 100)) } catch {}
        if (props.autoplay) play()
      },
      onStateChange: (e: any) => {
        const st = (window as any).YT.PlayerState
        if (e.data === st.PLAYING) {
          playing.value = true
          completed.value = false
          startTick()
        }
        if (e.data === st.PAUSED) {
          playing.value = false
          stopTick()
        }
        if (e.data === st.ENDED) {
          // native end (if end param not provided)
          onComplete()
        }
      }
    }
  })
}

function startTick() {
  stopTick()
  tick = setInterval(() => {
    try {
      const t = player?.getCurrentTime?.() ?? startSec.value
      current.value = t
      const endV = endSec.value ?? duration.value
      if (t >= endV) {
        pause()
        seekTo(endV, false)
        onComplete()
      }
    } catch {}
  }, 200)
}
function stopTick() { if (tick) clearInterval(tick); tick = null }

function seekTo(sec: number, andPlay = true) {
  const low = startSec.value
  const high = endSec.value ?? duration.value || low
  const clamped = Math.min(Math.max(low, sec), high)
  player?.seekTo?.(clamped, true)
  current.value = clamped
  if (andPlay) play()
}

function play() { try { player?.playVideo?.() } catch {} }
function pause() { try { player?.pauseVideo?.() } catch {} }

function setMuted(v: boolean) {
  muted.value = v
  try { v ? player?.mute?.() : player?.unMute?.() } catch {}
}
function setVolume01(v: number) {
  volume.value = Math.max(0, Math.min(1, v))
  try {
    player?.setVolume?.(Math.round(volume.value * 100))
    if (volume.value > 0 && muted.value) setMuted(false)
  } catch {}
}

function jumpToStart() { seekTo(startSec.value, true) }
function jumpToEnd()   { seekTo((endSec.value ?? duration.value), false); onComplete() }

function onComplete() {
  stopTick()
  playing.value = false
  completed.value = true
}

function replay() {
  completed.value = false
  seekTo(startSec.value, true)
}

onMounted(async () => { await loadYT(); createPlayer() })
onBeforeUnmount(() => { stopTick(); try { player?.destroy?.() } catch {} })

/* Keyboard: space play/pause, left/right -5/+5s (bounded) */
const wrapper = ref<HTMLElement | null>(null)
function onKey(e: KeyboardEvent) {
  if (!wrapper.value) return
  if (e.key === ' ') { e.preventDefault(); playing.value ? pause() : play(); return }
  if (e.key === 'ArrowLeft') { e.preventDefault(); seekTo(current.value - 5) }
  if (e.key === 'ArrowRight') { e.preventDefault(); seekTo(current.value + 5) }
  if (e.key.toLowerCase() === 'm') { e.preventDefault(); setMuted(!muted.value) }
}

/* Slider */
const sliderVal = computed({
  get: () => clipPos.value,
  set: (v: number) => {
    const target = startSec.value + Number(v || 0)
    seekTo(target, false)
  }
})

watch(playing, p => { if (p) startTick(); else stopTick() })
</script>

<template>
  <!-- Block pointer events to the iframe; we control everything -->
  <figure
    ref="wrapper"
    class="yc-frame"
    :style="{ aspectRatio: ratio }"
    :aria-label="title"
    tabindex="0"
    @keydown="onKey"
    @contextmenu.prevent
  >
    <div ref="hostRef" class="yc-host" />

    <!-- Custom Controls (overlay, pointer-events enabled) -->
    <div class="yc-ui">
      <div class="yc-row">
        <button class="yc-btn" type="button" @click="jumpToStart" title="Go to start">
          ⏮︎
        </button>

        <button class="yc-btn" type="button" @click="playing ? pause() : play()" :aria-pressed="playing">
          <span v-if="!playing">▶︎</span>
          <span v-else>⏸︎</span>
        </button>

        <button class="yc-btn" type="button" @click="jumpToEnd" title="Jump to end">
          ⏭︎
        </button>

        <div class="yc-time">
          <span>{{ fmt(current - startSec) }}</span>
          <span class="yc-time-sep">/</span>
          <span>{{ fmt(clipLen) }}</span>
        </div>
      </div>

      <div class="yc-row gap">
        <input
          class="yc-slider"
          type="range"
          min="0"
          :max="clipLen"
          step="0.1"
          v-model="sliderVal"
          aria-label="Seek"
        />

        <button class="yc-btn" type="button" @click="setMuted(!muted)">
          <span v-if="muted || volume === 0">🔇</span>
          <span v-else-if="volume < 0.5">🔈</span>
          <span v-else>🔊</span>
        </button>

        <input
          class="yc-vol"
          type="range"
          min="0"
          max="1"
          step="0.01"
          :value="volume"
          @input="setVolume01(Number(($event.target as HTMLInputElement).value))"
          aria-label="Volume"
        />
      </div>
    </div>

    <!-- Completion Overlay -->
    <transition name="yc-fade">
      <div v-if="showCompleteOverlay && completed" class="yc-overlay">
        <div class="yc-card">
          <div class="yc-check">✓</div>
          <h3 class="yc-title">{{ completeTitle }}</h3>
          <p class="yc-desc">{{ completeDescription }}</p>
          <div class="yc-actions">
            <button class="yc-btn" type="button" @click="replay">Replay</button>
          </div>
        </div>
      </div>
    </transition>
  </figure>
</template>

<style scoped>
/* Frame */
.yc-frame {
  width: 100%;
  position: relative;
  background: var(--ui-bg, #fff);
  border: 1px solid var(--ui-border, rgba(0,0,0,.1));
  border-radius: var(--ui-radius, .25rem);
  overflow: hidden;
  box-shadow: var(--ui-shadow, 0 1px 2px rgba(3,45,96,.06), 0 3px 8px rgba(3,45,96,.05));
  outline: none;
}
.yc-host,
.yc-frame :deep(iframe) {
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none; /* disable all direct interactions with YT */
}

/* UI overlay */
.yc-ui {
  position: absolute; inset: auto 0 0 0;
  padding: .6rem .75rem;
  background: linear-gradient(to top, color-mix(in oklab, var(--color-slate-950, #1F2A44) 22%, transparent), transparent);
  display: grid; gap: .45rem;
  pointer-events: auto;
}
.yc-row { display: flex; align-items: center; gap: .4rem; }
.yc-row.gap { gap: .6rem; }

/* Buttons */
.yc-btn {
  -webkit-appearance: none; appearance: none;
  border: 1px solid color-mix(in oklab, var(--color-slate-300, #C9CEDA) 65%, transparent);
  background: color-mix(in oklab, var(--color-blue-50, #EAF5FF) 45%, white);
  color: var(--color-blue-900, #053B70);
  padding: .35rem .55rem;
  border-radius: .375rem;
  font-weight: 600;
  cursor: pointer;
}
.yc-btn:hover { background: color-mix(in oklab, var(--color-blue-100, #D8ECFF) 60%, white); }

/* Time */
.yc-time { margin-left: .25rem; display: inline-flex; gap: .3rem; align-items: baseline; color: var(--color-slate-700, #4E5E78); font-variant-numeric: tabular-nums; }
.yc-time-sep { opacity: .8 }

/* Sliders */
.yc-slider {
  flex: 1;
  appearance: none;
  height: .35rem;
  background: color-mix(in oklab, var(--color-slate-300, #C9CEDA) 45%, transparent);
  border-radius: 999px;
  outline: none;
}
.yc-slider::-webkit-slider-thumb {
  appearance: none;
  width: .9rem; height: .9rem; border-radius: 50%;
  background: var(--ui-primary, #0176D3);
  border: 2px solid white;
  box-shadow: 0 0 0 2px color-mix(in oklab, var(--ui-primary, #0176D3) 35%, transparent);
}
.yc-vol {
  width: 110px; min-width: 90px;
  appearance: none; height: .28rem; border-radius: 999px;
  background: color-mix(in oklab, var(--color-slate-300, #C9CEDA) 45%, transparent);
  outline: none;
}
.yc-vol::-webkit-slider-thumb {
  appearance: none; width: .75rem; height: .75rem; border-radius: 999px;
  background: var(--ui-primary, #0176D3); border: 2px solid white;
}

/* Completion overlay */
.yc-overlay {
  position: absolute; inset: 0;
  display: grid; place-items: center;
  background: color-mix(in oklab, var(--color-blue-950, #032D60) 55%, transparent);
  backdrop-filter: blur(2px);
}
.yc-card {
  width: min(560px, 92%);
  padding: 1.1rem 1rem .9rem;
  background: color-mix(in oklab, white 92%, var(--color-blue-50, #EAF5FF));
  border: 1px solid color-mix(in oklab, var(--color-slate-300, #C9CEDA) 70%, transparent);
  border-radius: .75rem;
  text-align: center;
  box-shadow: 0 10px 28px rgba(3,45,96,.15);
}
.yc-check {
  width: 44px; height: 44px; margin: 0 auto .5rem;
  border-radius: 9999px; display: grid; place-items: center; font-weight: 800;
  background: color-mix(in oklab, var(--color-green-500, #2E844A) 12%, white);
  color: var(--color-green-700, #1B5A31);
}
.yc-title { margin:.25rem 0; font-weight: 800; letter-spacing:-.01em; color: var(--color-blue-950, #032D60);}
.yc-desc  { margin:0 0 .75rem; color: var(--color-slate-700, #4E5E78);}
.yc-actions { display:flex; justify-content:center; gap:.5rem; }

.yc-fade-enter-active, .yc-fade-leave-active { transition: opacity .18s ease; }
.yc-fade-enter-from, .yc-fade-leave-to { opacity: 0; }

/* Dark mode */
:host(.dark) .yc-ui,
.dark .yc-ui { background: linear-gradient(to top, color-mix(in oklab, black 35%, transparent), transparent); }
.dark .yc-card { background: color-mix(in oklab, var(--color-slate-900, #2B3852) 75%, white); color: #fff; }
</style>
