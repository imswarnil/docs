---
seo:
  title: CRM Analytics Academy
  description: Create stunning, fast and SEO-optimized documentation sites with Nuxt UI.
---
::u-page-hero{class="relative overflow-hidden dark:bg-gradient-to-b from-neutral-900 to-neutral-950"}
---
orientation: horizontal
align: left
descriptionProse: true
---
#top
:hero-background
  <div class="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_60%_at_50%_30%,#000_60%,transparent_100%)]">
    <div class="absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-[color:var(--ui-primary)]/20 blur-3xl"></div>
    <div class="absolute -bottom-24 -right-24 h-[420px] w-[420px] rounded-full bg-[color:var(--ui-primary)]/10 blur-3xl"></div>
  </div>

#eyebrow
Salesforce CRM Analytics

#title
Master CRM Analytics with confidence

#description
Step-by-step guides, data recipes, dashboards, and SAQL you can ship today. Clear patterns, SLDS-friendly UI, and production-ready examples for real teams.

#links
  :::u-button
  ---
  to: /getting-started
  size: xl
  trailing-icon: i-lucide-arrow-right
  ---
  Start learning
  :::

  :::u-button
  ---
  color: neutral
  variant: outline
  size: xl
  to: /docs/syllabus
  trailing-icon: i-lucide-book-open
  ---
  View syllabus
  :::

#default
  <div class="grid w-full gap-4 sm:grid-cols-3">
    <UCallout
      icon="i-lucide-badge-check"
      title="Setup and permissions"
      description="Enable CRM Analytics, assign licenses, and verify org readiness."
    />
    <UCallout
      icon="i-lucide-database"
      title="Data manager"
      description="Connectors, sync, dataflows, and recipes for clean, reliable datasets."
    />
    <UCallout
      icon="i-lucide-area-chart"
      title="Dashboards and SAQL"
      description="Queries, bindings, and interactions that tell a clear story."
    />
  </div>
::
as

::u-page-section{class="dark:bg-neutral-950"}
#title
Enhanced with Nuxt Content

#links
  :::u-button
  ---
  color: neutral
  size: lg
  target: _blank
  to: https://content.nuxt.com/docs/getting-started/installation
  trailingIcon: i-lucide-arrow-right
  variant: subtle
  ---
  Explore Nuxt Content
  :::

#features
  :::u-page-feature
  ---
  icon: i-simple-icons-markdown
  ---
  #title
  MDC Enhanced Markdown

  #description
  Write in Markdown while embedding Vue components. Seamlessly integrate interactive elements in your content.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-file-text
  ---
  #title
  File-based Routing

  #description
  Organize content in folders and files. Your documentation structure automatically becomes your navigation.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-code
  ---
  #title
  Syntax Highlighting

  #description
  Beautiful code blocks with language detection, line numbers, and copy buttons. Support for 100+ languages.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-database
  ---
  #title
  Content Database

  #description
  Query your content with a MongoDB-like API. Filter, sort, and search through your documentation programmatically.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-file-code
  ---
  #title
  Frontmatter Support

  #description
  Add metadata to your content files. Define SEO tags, navigation properties, and custom fields.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-git-branch
  ---
  #title
  Version Control

  #description
  Content lives in your repository. Branch, review, and deploy documentation alongside your code.
  :::
::

::u-page-section{class="dark:bg-gradient-to-b from-neutral-950 to-neutral-900"}
  :::u-page-c-t-a
  ---
  links:
    - label: Start building
      to: '/getting-started'
      trailingIcon: i-lucide-arrow-right
    - label: View on GitHub
      to: 'https://github.com/nuxt-ui-templates/docs'
      target: _blank
      variant: subtle
      icon: i-simple-icons-github
  title: Ready to build an amazing documentation?
  description: Join thousands of developers building with Nuxt and Nuxt UI. Get this template and start shipping today.
  class: dark:bg-neutral-950
  ---

  :stars-bg
  :::
::
