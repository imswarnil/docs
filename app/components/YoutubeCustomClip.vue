<template>
    <div class="ytc-wrap">
      <!-- IFRAME MOUNT -->
      <div class="ytc-frame" ref="mountEl" />
  
      <!-- COMPLETED OVERLAY -->
      <div v-if="completed" class="ytc-complete">
        <div class="ytc-complete-card">
          <span class="ytc-complete-dot" />
          <p>Video completed</p>
          <button class="ytc-btn" @click="jumpToStart(); play()">Replay</button>
        </div>
      </div>
  
      <!-- POSTER (until ready / play) -->
      <button
        v-if="!ready"
        class="ytc-poster"
        :style="posterStyle"
        @click="initAndPlay"
      >
        <span class="ytc-bigplay" />
      </button>
  
      <!-- CUSTOM CONTROLS -->
      <div v-if="controls" class="ytc-controls" :class="{ 'ytc-disabled': !ready }">
        <button class="ytc-btn" @click="togglePlay" :disabled="!ready" :aria-label="playing ? 'Pause' : 'Play'">
          <span v-if="!playing">▶</span>
          <span v-else>⏸</span>
        </button>
  
        <button class="ytc-btn" @click="jumpToStart" :disabled="!ready" aria-label="Jump to start">⟲</button>
        <button class="ytc-btn" @click="jumpToEnd" :disabled="!ready" aria-label="Jump to end">⟶</button>
  
        <!-- PROGRESS -->
        <div class="ytc-progress" @click="scrub($event)">
          <div class="ytc-progress-fill" :style="{ width: progressPct + '%' }" />
        </div>
  
        <!-- TIME -->
        <div class="ytc-time">{{ mmss(current) }} / {{ mmss(endBound) }}</div>
  
        <!-- VOLUME -->
        <button class="ytc-btn" @click="toggleMute" :disabled="!ready" :aria-label="mutedRef ? 'Unmute' : 'Mute'">
          <span v-if="mutedRef || volumeRef === 0">🔇</span>
          <span v-else-if="volumeRef < 50">🔉</span>
          <span v-else>🔊</span>
        </button>
        <input
          class="ytc-volume"
          type="range"
          min="0"
          max="100"
          step="1"
          v-model.number="volumeRef"
          @input="applyVolume"
          :disabled="!ready"
          aria-label="Volume"
        />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted, onBeforeUnmount, ref, computed, watch } from 'vue'
  
  type MaybeNum = number | string | undefined
  
  const props = withDefaults(defineProps<{
    videoId: string
    start?: MaybeNum
    end?: MaybeNum
    autoplay?: boolean
    muted?: boolean
    volume?: number
    loop?: boolean
    poster?: string
    controls?: boolean
  }>(), {
    start: 0,
    end: undefined,
    autoplay: false,
    muted: false,
    volume: 80,
    loop: false,
    poster: '',
    controls: true
  })
  
  const mountEl = ref<HTMLDivElement | null>(null)
  const player = ref<any>(null)
  const ready = ref(false)
  const playing = ref(false)
  const completed = ref(false)
  
  const duration = ref(0)
  const startSec = ref(num(props.start) ?? 0)
  const endSec = ref<number | undefined>(num(props.end))
  const current = ref(startSec.value)
  
  const volumeRef = ref(clamp(props.volume ?? 80, 0, 100))
  const mutedRef = ref(!!props.muted)
  
  let rafId: number | null = null
  
  const endBound = computed(() => endSec.value ?? duration.value ?? startSec.value)
  const clipLen = computed(() => Math.max(0, (endSec.value ?? duration.value ?? 0) - startSec.value))
  const progressPct = computed(() => {
    const span = Math.max(0.0001, clipLen.value)
    return clamp(((current.value - startSec.value) / span) * 100, 0, 100)
  })
  
  const posterStyle = computed(() => ({
    backgroundImage: props.poster ? `url('${props.poster}')` : 'none'
  }))
  
  function num(v: MaybeNum): number | undefined {
    if (v === '' || v === null || v === undefined) return undefined
    const n = typeof v === 'string' ? Number(v) : v
    return Number.isFinite(n) ? n : undefined
  }
  
  function clamp(n:number, min:number, max:number){ return Math.min(Math.max(n, min), max) }
  
  function loadApi(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve()
      const w = window as any
      if (w.YT && w.YT.Player) return resolve()
      const existing = document.getElementById('youtube-iframe-api')
      if (existing) {
        w.onYouTubeIframeAPIReady
          ? resolve()
          : (w.onYouTubeIframeAPIReady = () => resolve())
        return
      }
      const tag = document.createElement('script')
      tag.id = 'youtube-iframe-api'
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
      w.onYouTubeIframeAPIReady = () => resolve()
    })
  }
  
  function createPlayer() {
    const w = window as any
    if (!mountEl.value || !w.YT || !w.YT.Player) return
  
    player.value = new w.YT.Player(mountEl.value, {
      width: '100%',
      height: '100%',
      videoId: props.videoId,
      playerVars: {
        // Hide YT UI as much as allowed by TOS
        controls: 0,
        modestbranding: 1,
        rel: 0,
        fs: 0,
        iv_load_policy: 3,
        disablekb: 1,
        playsinline: 1,
        // NOTE: start/end passed again on load to be safe
        origin: location.origin
      },
      events: {
        onReady: (e: any) => {
          duration.value = Math.floor(e.target.getDuration?.() || 0)
          if (endSec.value == null && duration.value) endSec.value = duration.value
          applyVolume()
          if (mutedRef.value) e.target.mute()
          else e.target.unMute()
  
          // Ensure initial bounds
          e.target.seekTo?.(startSec.value, true)
          current.value = startSec.value
  
          ready.value = true
          completed.value = false
  
          // Autoplay if requested
          if (props.autoplay) play()
  
          // Start ticking
          tick()
        },
        onStateChange: (evt: any) => {
          // 1 = playing, 2 = paused, 0 = ended
          if (evt.data === 1) playing.value = true
          if (evt.data === 2) playing.value = false
          if (evt.data === 0) handleEnd()
        }
      }
    })
  }
  
  function initAndPlay() {
    loadApi().then(() => {
      if (!player.value) createPlayer()
      else play()
    })
  }
  
  function play() {
    completed.value = false
    player.value?.playVideo?.()
  }
  
  function pause() {
    player.value?.pauseVideo?.()
  }
  
  function togglePlay() {
    if (!ready.value) return
    playing.value ? pause() : play()
  }
  
  function seekTo(sec: number, andPlay = true) {
    const low = startSec.value
    const high = endSec.value ?? duration.value ?? low
    const clamped = Math.min(Math.max(low, sec), high)
    player.value?.seekTo?.(clamped, true)
    current.value = clamped
    if (andPlay) play()
  }
  
  function scrub(e: MouseEvent) {
    if (!ready.value) return
    const el = e.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    const x = clamp(e.clientX - rect.left, 0, rect.width)
    const ratio = x / rect.width
    const target = startSec.value + ratio * clipLen.value
    seekTo(target, true)
  }
  
  function jumpToStart() {
    seekTo(startSec.value, false)
  }
  
  function jumpToEnd() {
    const endV = endSec.value ?? duration.value ?? startSec.value
    seekTo(endV, false)
    handleEnd()
  }
  
  function handleEnd() {
    playing.value = false
    if (props.loop) {
      jumpToStart()
      play()
    } else {
      completed.value = true
    }
  }
  
  function applyVolume() {
    const v = clamp(volumeRef.value, 0, 100)
    player.value?.setVolume?.(v)
    if (v === 0) {
      player.value?.mute?.()
      mutedRef.value = true
    } else if (!mutedRef.value) {
      player.value?.unMute?.()
    }
  }
  
  function toggleMute() {
    if (!ready.value) return
    if (mutedRef.value) {
      mutedRef.value = false
      player.value?.unMute?.()
      if (volumeRef.value === 0) { volumeRef.value = 20; applyVolume() }
    } else {
      mutedRef.value = true
      player.value?.mute?.()
    }
  }
  
  function tick() {
    // rAF loop to clamp within [start,end] and update progress
    if (!player.value) return
    const cur = Math.floor(player.value.getCurrentTime?.() || startSec.value)
    const endV = endSec.value ?? duration.value ?? startSec.value
    if (cur >= endV - 0.05) {
      // Reached end bound
      player.value.pauseVideo?.()
      current.value = endV
      handleEnd()
    } else if (cur < startSec.value) {
      player.value.seekTo?.(startSec.value, true)
      current.value = startSec.value
    } else {
      current.value = cur
    }
    rafId = requestAnimationFrame(tick)
  }
  
  function mmss(sec: number) {
    const s = Math.max(0, Math.floor(sec))
    const m = Math.floor(s / 60)
    const r = s % 60
    return `${m}:${r.toString().padStart(2, '0')}`
  }
  
  watch(() => props.start, (v) => {
    const n = num(v) ?? 0
    startSec.value = clamp(n, 0, endSec.value ?? duration.value ?? n)
    if (ready.value) seekTo(startSec.value, false)
  })
  watch(() => props.end, (v) => {
    const n = num(v)
    endSec.value = n
  })
  
  onMounted(() => {
    // Lazy create when user clicks; or preload:
    // loadApi().then(createPlayer)
    // We wait for click to avoid autoplay restrictions.
  })
  
  onBeforeUnmount(() => {
    if (rafId) cancelAnimationFrame(rafId)
    try { player.value?.destroy?.() } catch {}
  })
  </script>
  
  <style scoped>
  .ytc-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 12px;
    overflow: hidden;
    background: oklch(0.98 0 0 / .9);
    box-shadow: var(--ui-shadow, 0 2px 12px rgba(3,45,96,.1));
  }
  
  /* Iframe mount */
  .ytc-frame { width: 100%; height: 100%; }
  
  /* Poster */
  .ytc-poster{
    position:absolute; inset:0;
    display:flex; align-items:center; justify-content:center;
    background-size: cover; background-position: center;
    border: none; cursor: pointer;
  }
  .ytc-bigplay{
    width: 68px; height: 68px; border-radius: 9999px;
    background: rgba(3,45,96,.85);
    box-shadow: 0 10px 30px rgba(3,45,96,.35), inset 0 0 0 2px rgba(255,255,255,.35);
    position: relative;
  }
  .ytc-bigplay::after{
    content:'';
    position:absolute; left:26px; top:19px;
    border-left: 18px solid white;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
  }
  
  /* Controls */
  .ytc-controls{
    position:absolute; left:0; right:0; bottom:0;
    display:flex; align-items:center; gap:.5rem;
    padding:.5rem .75rem;
    background: linear-gradient(to top, rgba(6,28,61,.55), rgba(6,28,61,0));
    color:#fff;
  }
  .ytc-disabled{ opacity:.6; filter: grayscale(.15); pointer-events: none; }
  
  .ytc-btn{
    appearance:none; border:1px solid rgba(255,255,255,.25);
    background: rgba(255,255,255,.08);
    color:#fff; border-radius:8px; padding:.35rem .55rem; font-weight:600;
    line-height:1; transition:.15s ease;
  }
  .ytc-btn:hover{ background: rgba(255,255,255,.16); border-color: rgba(255,255,255,.35); }
  
  .ytc-progress{
    position:relative; flex:1; height:8px; border-radius:9999px;
    background: rgba(255,255,255,.18); cursor:pointer; overflow:hidden;
  }
  .ytc-progress-fill{
    position:absolute; left:0; top:0; bottom:0;
    background: linear-gradient(90deg, #59A8FF, #0176D3);
  }
  
  .ytc-time{ font-variant-numeric: tabular-nums; opacity:.95; font-weight:600; }
  
  .ytc-volume{ width:110px; accent-color:#0176D3; }
  
  /* Completed overlay */
  .ytc-complete{
    position:absolute; inset:0; display:grid; place-items:center;
    background: linear-gradient(to bottom right, rgba(3,45,96,.35), rgba(3,45,96,.15));
    backdrop-filter: blur(2px);
  }
  .ytc-complete-card{
    background: rgba(255,255,255,.9);
    color: #032D60;
    padding: 1rem 1.25rem; border-radius: 12px;
    border: 1px solid rgba(3,45,96,.15);
    text-align:center; display:flex; flex-direction:column; gap:.5rem; align-items:center;
    box-shadow: 0 10px 30px rgba(3,45,96,.15);
  }
  .ytc-complete-dot{
    width:10px; height:10px; border-radius:9999px; background:#2E844A;
    box-shadow: 0 0 0 5px rgba(46,132,74,.15);
  }
  </style>
  