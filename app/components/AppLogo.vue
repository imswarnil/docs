<template>
  <svg
    viewBox="0 0 1020 200"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    preserveAspectRatio="xMinYMid meet"
    role="img"
    aria-label="CRMA"
    class="w-auto shrink-0"
    style="height: var(--logo-h, 1.5rem);"  <!-- control height here -->
  >
    <title>CRMA</title>

    <!-- 3-bar chart icon (left) -->
    <g transform="translate(20,0)">
      <!-- short -->
      <rect x="20"  y="104" width="44" height="76"  rx="10" fill="var(--ui-primary)"/>
      <!-- mid -->
      <rect x="80"  y="60"  width="44" height="120" rx="10" fill="var(--ui-primary)" opacity="0.9"/>
      <!-- tall -->
      <rect x="140" y="24"  width="44" height="156" rx="10" fill="var(--ui-primary)" opacity="0.85"/>
    </g>

    <!-- Wordmark pinned to right edge (no extra right gap) -->
    <text
      x="1020"
      y="165"
      text-anchor="end"
      fill="currentColor"
      font-family="Outfit, Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
      font-size="180"
      font-weight="900"
      letter-spacing="-0.03em"
    >
      CRMA
    </text>
  </svg>
</template>
