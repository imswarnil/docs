<template>
  <svg
    width="1020"
    height="200"
    viewBox="0 0 1020 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="w-auto h-6 shrink-0"
    role="img"
    aria-label="CRMA Training"
  >
    <title>CRMA Training</title>

    <!-- 3-bar chart mark (brand color) -->
    <g transform="translate(24,12)">
      <rect x="16"  y="64"  width="36" height="124" rx="8" fill="var(--ui-primary)" />
      <rect x="68"  y="36"  width="36" height="152" rx="8" fill="var(--ui-primary)" />
      <rect x="120" y="12"  width="36" height="176" rx="8" fill="var(--ui-primary)" />
      <rect x="0" y="188" width="188" height="2" fill="currentColor" opacity=".08" />
    </g>

    <!-- Wordmark (inherits currentColor to adapt to theme) -->
    <g transform="translate(220,0)" fill="currentColor">
      <text
        x="0" y="108"
        font-family="Outfit, Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
        font-size="104"
        font-weight="900"
        letter-spacing="-0.02em"
        style="text-transform:uppercase"
      >
        CRMA
      </text>

      <text
        x="0" y="172"
        font-family="Outfit, Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
        font-size="66"
        font-weight="800"
        letter-spacing="0.02em"
        style="text-transform:uppercase"
        opacity=".95"
      >
        TRAINING
      </text>
    </g>
  </svg>
</template>
