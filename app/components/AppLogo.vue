<template>
  <svg
    width="1020"
    height="200"
    viewBox="0 0 1020 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- 3-bar chart icon (left), aligned to a common baseline -->
    <g transform="translate(20,0)">
      <!-- short -->
      <rect x="20"  y="104" width="44" height="76"  rx="10" fill="var(--ui-primary)"/>
      <!-- mid -->
      <rect x="80"  y="60"  width="44" height="120" rx="10" fill="var(--ui-primary)" opacity="0.9"/>
      <!-- tall -->
      <rect x="140" y="24"  width="44" height="156" rx="10" fill="var(--ui-primary)" opacity="0.85"/>
    </g>

    <!-- Wordmark: CRMA (same canvas, no extra margins) -->
    <!-- Use text-anchor="end" to keep it flush with the right edge of the viewBox -->
    <text
      x="1020"
      y="170"
      text-anchor="end"
      fill="currentColor"
      font-family="Outfit, Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
      font-size="190"
      font-weight="900"
      letter-spacing="-0.03em"
    >
      CRMA
    </text>
  </svg>
</template>
