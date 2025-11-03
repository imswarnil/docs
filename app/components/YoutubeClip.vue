<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'

type TimeLike = number | string

const props = withDefaults(defineProps<{
  videoId: string
  start?: TimeLike
  end?: TimeLike
  autoplay?: boolean
  muted?: boolean
  controls?: boolean
  playsinline?: boolean
  ratio?: string // e.g. "16/9", "4/3"
  title?: string
}>(), {
  start: 0,
  end: undefined,
  autoplay: true,
  muted: true,
  controls: true,
  playsinline: true,
  ratio: '16/9',
  title: 'YouTube clip'
})

/** Parse "hh:mm:ss" | "mm:ss" | "ss" | number -> seconds */
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
let player: any = null
let tick: any = null

// Load the YouTube IFrame API once per app
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
      controls: props.controls ? 1 : 0,
      rel: 0,
      modestbranding: 1,
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
        // Re-start the tick only when playing
        if (e.data === (window as any).YT.PlayerState.PLAYING) startTick()
        if (e.data === (window as any).YT.PlayerState.PAUSED) stopTick()
        if (e.data === (window as any).YT.PlayerState.ENDED) stopTick()
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
        // Clean stop at end boundary
        player?.pauseVideo?.()
        player?.seekTo?.(endSec.value, true)
        stopTick()
      }
    } catch { /* ignore */ }
  }, 200)
}

function stopTick() {
  if (tick) {
    clearInterval(tick)
    tick = null
  }
}

onMounted(async () => {
  await loadYT()
  createPlayer()
})

onBeforeUnmount(() => {
  stopTick()
  try { player?.destroy?.() } catch { /* ignore */ }
})
</script>

<template>
  <figure class="yt-clip-frame" :style="{ aspectRatio: ratio }" :aria-label="title">
    <!-- YT API will inject an iframe in this div -->
    <div ref="hostRef" class="yt-clip-host" />
    <figcaption class="sr-only">{{ title }}</figcaption>
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
  /* Subtle shadow to match your SLDS-ish theme */
  box-shadow: var(--ui-shadow, 0 1px 2px rgba(3,45,96,0.06), 0 3px 8px rgba(3,45,96,.05));
}
.yt-clip-host,
.yt-clip-frame :deep(iframe) {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
