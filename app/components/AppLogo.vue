<template>
  <svg
    viewBox="0 0 1600 200"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    role="img"
    aria-label="CRM Analytics Academy"
    class="crma-logo w-auto h-[var(--logo-h,1.75rem)] shrink-0"
    style="height: var(--logo-h, 1.75rem);"
    preserveAspectRatio="xMinYMid meet"
  >
    <title>CRM Analytics Academy</title>

    <!-- Icon: 3 bars -->
    <g class="crma-logo__icon" transform="translate(16,0)">
      <rect x="20"  y="128" width="44" height="72"  rx="10" fill="var(--ui-primary, #009ED9)" />
      <rect x="80"  y="86"  width="44" height="114" rx="10" fill="var(--ui-primary, #009ED9)" opacity="0.9" />
      <rect x="140" y="50"  width="44" height="150" rx="10" fill="var(--ui-primary, #009ED9)" opacity="0.85" />
    </g>

    <!-- Full wordmark (desktop/tablet) -->
    <text
      class="crma-logo__wordmark crma-logo__wordmark--full"
      x="260"
      y="170"
      fill="currentColor"
      font-family="Outfit, Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
      font-size="140"
      font-weight="800"
      textLength="1300"
      lengthAdjust="spacingAndGlyphs"
      dominant-baseline="alphabetic"
      style="letter-spacing:-4.9px;"
    >
      CRM Analytics Academy
    </text>

    <!-- Abbreviation (mobile) -->
    <text
      class="crma-logo__wordmark crma-logo__wordmark--abbr"
      x="260"
      y="170"
      fill="currentColor"
      font-family="Outfit, Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
      font-size="160"
      font-weight="900"
      textLength="520"
      lengthAdjust="spacingAndGlyphs"
      dominant-baseline="alphabetic"
      style="letter-spacing:-2px;"
    >
      CRMA
    </text>
  </svg>
</template>
