---
seo:
  title: Nuxt Docs Template
  description: Create stunning, fast and SEO-optimized documentation sites with Nuxt UI.
---


<!-- Static HTML hero (no MDC components). Tailwind utility classes work if Tailwind is enabled. -->
<section id="hero" class="relative overflow-hidden bg-white dark:bg-neutral-950">
  <div class="mx-auto max-w-screen-xl px-6 py-16 md:py-24">
    <div class="grid items-center gap-12 md:grid-cols-2">
      <!-- Left: copy -->
      <div>
        <p class="mb-3 inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-xs font-medium tracking-wide text-gray-600 dark:border-neutral-800 dark:text-neutral-300">
          CRM Analytics Academy
        </p>
        <h1 class="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-5xl">
          Learn Salesforce <span class="text-primary">CRM Analytics</span> end to end
        </h1>
        <p class="mt-4 max-w-prose text-neutral-600 dark:text-neutral-300">
          Set up your org, model clean datasets, and build dashboards that your team actually uses.
          Clear steps, real examples, and production tips.
        </p>
        <div class="mt-8 flex flex-wrap items-center gap-3">
          <a
            href="/getting-started"
            class="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Get started
            <span aria-hidden="true" class="ml-2">→</span>
          </a>
          <a
            href="https://github.com/nuxt-ui-templates/docs"
            target="_blank"
            rel="noopener"
            class="inline-flex items-center justify-center rounded-md border border-neutral-200 px-5 py-3 text-sm font-semibold text-neutral-800 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-900"
          >
            View on GitHub
          </a>
        </div>
        <dl class="mt-8 grid grid-cols-3 gap-6 text-center md:max-w-md">
          <div class="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
            <dt class="text-xs text-neutral-500 dark:text-neutral-400">Lessons</dt>
            <dd class="text-lg font-semibold text-neutral-900 dark:text-neutral-50">40+</dd>
          </div>
          <div class="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
            <dt class="text-xs text-neutral-500 dark:text-neutral-400">Dashboards</dt>
            <dd class="text-lg font-semibold text-neutral-900 dark:text-neutral-50">15+</dd>
          </div>
          <div class="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
            <dt class="text-xs text-neutral-500 dark:text-neutral-400">Recipes & SAQL</dt>
            <dd class="text-lg font-semibold text-neutral-900 dark:text-neutral-50">80+</dd>
          </div>
        </dl>
      </div>
      <!-- Right: video -->
      <div class="relative">
        <div class="rounded-xl border border-neutral-200 bg-white p-2 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div class="overflow-hidden rounded-lg">
            <iframe
              src="https://www.youtube-nocookie.com/embed/_eQxomah-nA?si=pDSzchUBDKb2NQu7"
              title="CRM Analytics Overview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
              style="aspect-ratio: 16/9; width: 100%; display: block;"
            ></iframe>
          </div>
        </div>
        <!-- soft glow -->
        <div aria-hidden="true" class="pointer-events-none absolute -inset-8 -z-10 rounded-[28px] opacity-40 blur-2xl"
             style="background: radial-gradient(120% 120% at 10% 10%, rgba(0,158,217,.25), transparent 60%), radial-gradient(120% 120% at 90% 30%, rgba(0,158,217,.15), transparent 60%);">
        </div>
      </div>
    </div>
  </div>
</section>


::u-page-hero{class="dark:bg-gradient-to-b from-neutral-900 to-neutral-950"}
---
orientation: horizontal
---
#top
:hero-background

#title
Learn Salesforce [CRMAnalytics]{.text-primary}.

#description
Build professional documentation with Nuxt UI's powerful components, enhanced typography, and seamless Nuxt Content integration. The same system trusted by the entire [Nuxt ecosystem](https://nuxt.com).

#links
  :::u-button
  ---
  to: /getting-started
  size: xl
  trailing-icon: i-lucide-arrow-right
  ---
  Get started
  :::

  :::u-button
  ---
  icon: i-simple-icons-github
  color: neutral
  variant: outline
  size: xl
  to: https://github.com/nuxt-ui-templates/docs
  target: _blank
  ---
  Use this template
  :::

#default
<iframe src="https://www.youtube-nocookie.com/embed/_eQxomah-nA?si=pDSzchUBDKb2NQu7" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="aspect-ratio: 16/9; width: 100%;"></iframe>
::

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
