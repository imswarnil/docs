<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'

type TimeLike = number | string

const props = withDefaults(defineProps<{
  videoId: string
  start?: TimeLike
  end?: TimeLike
  autoplay?: boolean
  muted?: boolean
  /** Hide native controls and use our clean player look */
  controls?: boolean
  /** Keep it inside the page without full-screen button */
  playsinline?: boolean
  /** Aspect ratio for the frame */
  ratio?: string
  /** Accessible label */
  title?: string

  /** Finish overlay content */
  completeTitle?: string
  completeDescription?: string
  showReplay?: boolean
}>(), {
  start: 0,
  end: undefined,
  autoplay: true,
  muted: true,
  controls: false,          // HIDDEN by default
  playsinline: true,
  ratio: '16/9',
  title: 'YouTube clip',

  completeTitle: 'Video completed',
  completeDescription: 'You’ve reached the end of this clip.',
  showReplay: true
})

function toSeconds(v?: TimeLike): number | undefined {
  if (v === undefined || v === null) return undefined
  if (typeof v === 'number') return Math.max(0, Math.floor(v))
  const parts = String(v).trim().split(':').map(n => Number(n))
  if (parts.some(isNaN)) return undefined
  let s = 0
  if (parts.length === 1) s = parts[0]
  if (parts.length === 2) s = parts[0] * 60 + parts[1]
  if (parts.length === 3) s = parts[0] * 3600 + parts[1] * 60 + parts[2]
  return Math.max(0, Math.floor(s))
}

const startSec = computed(() => toSeconds(props.start) ?? 0)
const endSec = computed(() => toSeconds(props.end))

const hostRef = ref<HTMLDivElement | null>(null)
const isCompleted = ref(false)

let player: any = null
let tick: any = null

function loadYT(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  const w = window as any
  if (w.YT && w.YT.Player) return Promise.resolve()
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
      start: startSec.value,
      ...(endSec.value ? { end: endSec.value } : {}),
      autoplay: props.autoplay ? 1 : 0,
      controls: props.controls ? 1 : 0, // 0 = hidden
      rel: 0,                // only show related from same channel when applicable
      modestbranding: 1,     // reduce YT branding
      fs: 0,                 // hide fullscreen button
      disablekb: 1,          // disable keyboard shortcuts (so it feels less like YT)
      iv_load_policy: 3,     // hide video annotations
      playsinline: props.playsinline ? 1 : 0,
      enablejsapi: 1,
      origin: location.origin
    },
    events: {
      onReady: (e: any) => {
        if (props.muted) e.target.mute()
        if (props.autoplay) e.target.playVideo()
        startTick()
      },
      onStateChange: (e: any) => {
        const state = (window as any).YT.PlayerState
        if (e.data === state.PLAYING) {
          isCompleted.value = false
          startTick()
        }
        if (e.data === state.PAUSED) stopTick()
        if (e.data === state.ENDED) {
          // native end (e.g., no custom end provided)
          showCompleted()
        }
      }
    }
  })
}

function startTick() {
  stopTick()
  if (!endSec.value) return
  tick = setInterval(() => {
    try {
      const t = player?.getCurrentTime?.() ?? 0
      if (t >= (endSec.value as number)) {
        // hard stop at end
        player?.pauseVideo?.()
        player?.seekTo?.(endSec.value, true)
        showCompleted()
      }
    } catch { /* ignore */ }
  }, 200)
}

function stopTick() {
  if (tick) clearInterval(tick)
  tick = null
}

function showCompleted() {
  stopTick()
  isCompleted.value = true
}

function replay() {
  isCompleted.value = false
  player?.seekTo?.(startSec.value, true)
  player?.playVideo?.()
  startTick()
}

onMounted(async () => {
  await loadYT()
  createPlayer()
})

onBeforeUnmount(() => {
  stopTick()
  try { player?.destroy?.() } catch {}
})
</script>

<template>
  <!-- Prevent right-click context menu (small extra to keep it “brand-light”) -->
  <figure class="yt-clip-frame" :style="{ aspectRatio: ratio }" :aria-label="title" @contextmenu.prevent>
    <div ref="hostRef" class="yt-clip-host" />

    <!-- Completed overlay -->
    <transition name="fade">
      <div v-if="isCompleted" class="yt-overlay">
        <div class="yt-card">
          <div class="yt-icon">✓</div>
          <h3 class="yt-title">{{ completeTitle }}</h3>
          <p class="yt-desc">{{ completeDescription }}</p>
          <div v-if="showReplay" class="yt-actions">
            <button class="yt-btn" type="button" @click="replay">Replay</button>
          </div>
        </div>
      </div>
    </transition>
  </figure>
</template>

<style scoped>
.yt-clip-frame {
  width: 100%;
  background: var(--ui-bg, #fff);
  border: 1px solid var(--ui-border, rgba(0,0,0,.1));
  border-radius: var(--ui-radius, .25rem);
  overflow: hidden;
  position: relative;
  box-shadow: var(--ui-shadow, 0 1px 2px rgba(3,45,96,0.06), 0 3px 8px rgba(3,45,96,.05));
}

.yt-clip-host,
.yt-clip-frame :deep(iframe) {
  width: 100%;
  height: 100%;
  display: block;
}

/* Completed overlay */
.yt-overlay {
  position: absolute; inset: 0;
  display: grid; place-items: center;
  background: color-mix(in oklab, var(--color-blue-950, #032D60) 60%, transparent);
  backdrop-filter: blur(2px);
}

.yt-card {
  width: min(560px, 92%);
  padding: 1.25rem 1.25rem 1rem;
  border-radius: .75rem;
  background: color-mix(in oklab, white 92%, var(--color-blue-50, #EAF5FF));
  border: 1px solid color-mix(in oklab, var(--color-slate-300, #C9CEDA) 70%, transparent);
  box-shadow: 0 10px 28px rgba(3,45,96,.15);
  text-align: center;
}

.yt-icon {
  width: 44px; height: 44px; margin: 0 auto .5rem;
  border-radius: 9999px;
  display: grid; place-items: center;
  font-weight: 800;
  background: color-mix(in oklab, var(--color-green-500, #2E844A) 12%, white);
  color: var(--color-green-600, #226B39);
}

.yt-title {
  margin: .25rem 0 .25rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--color-blue-950, #032D60);
}

.yt-desc {
  margin: 0 0 .75rem;
  color: var(--color-slate-700, #4E5E78);
}

.yt-actions { display: flex; justify-content: center; gap: .5rem; }

.yt-btn {
  appearance: none;
  border: 1px solid color-mix(in oklab, var(--color-blue-600, #0176D3) 70%, transparent);
  background: color-mix(in oklab, var(--color-blue-600, #0176D3) 15%, white);
  color: var(--color-blue-900, #053B70);
  padding: .5rem .9rem;
  border-radius: .375rem;
  font-weight: 600;
  cursor: pointer;
}
.yt-btn:hover { background: color-mix(in oklab, var(--color-blue-600, #0176D3) 20%, white); }

.fade-enter-active, .fade-leave-active { transition: opacity .18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
