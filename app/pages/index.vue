<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('landing').path('/').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/docs-light.png',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/docs-light.png'
})
</script>


<template>
  <div class="homepage">
    <!-- Hero Section -->
    <section class="hero dark:bg-gradient-to-b from-neutral-900 to-neutral-950">
      <div class="hero-background"></div>
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <h1 class="hero-title">
              Master <span class="text-primary">CRM Analytics</span>
            </h1>
            <p class="hero-description">
              Transform your data into actionable insights with our comprehensive Salesforce CRM Analytics training. 
              Learn from industry experts and unlock the full potential of your customer data.
            </p>
            <div class="hero-links">
              <button class="btn btn-primary btn-xl">
                Start Learning
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
              <button class="btn btn-neutral btn-outline btn-xl">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View Curriculum
              </button>
            </div>
          </div>
          <div class="hero-media">
            <div class="video-container">
              <div class="video-placeholder">
                <svg class="w-16 h-16 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                <p class="mt-4 text-lg font-medium">Watch Course Introduction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features dark:bg-neutral-950">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Why Choose Our CRMA Training?</h2>
          <p class="section-description">
            Comprehensive learning experience designed for professionals at all levels
          </p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <h3 class="feature-title">Industry Certified</h3>
            <p class="feature-description">
              Get certified by Salesforce professionals with real-world experience in CRM Analytics implementation.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/>
              </svg>
            </div>
            <h3 class="feature-title">Hands-on Projects</h3>
            <p class="feature-description">
              Work on real datasets and build portfolio projects that demonstrate your CRM Analytics expertise.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <h3 class="feature-title">Comprehensive Curriculum</h3>
            <p class="feature-description">
              From data preparation to advanced dashboard creation - master the complete CRM Analytics workflow.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <h3 class="feature-title">Community Support</h3>
            <p class="feature-description">
              Join our exclusive community of CRM Analytics professionals for networking and continuous learning.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="feature-title">Self-Paced Learning</h3>
            <p class="feature-description">
              Learn at your own pace with lifetime access to course materials and future updates.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="feature-title">Career Guidance</h3>
            <p class="feature-description">
              Get personalized career advice and interview preparation for CRM Analytics roles.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Course Modules Section -->
    <section class="modules dark:bg-gradient-to-b from-neutral-950 to-neutral-900">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Course Curriculum</h2>
          <p class="section-description">
            Structured learning path from fundamentals to advanced CRM Analytics concepts
          </p>
        </div>
        <div class="modules-grid">
          <div class="module-card">
            <div class="module-number">01</div>
            <h3 class="module-title">CRM Analytics Fundamentals</h3>
            <ul class="module-topics">
              <li>Introduction to CRM Analytics</li>
              <li>Data Preparation & Recipes</li>
              <li>Lens & Dashboard Basics</li>
              <li>Data Security & Governance</li>
            </ul>
            <div class="module-duration">4 weeks</div>
          </div>

          <div class="module-card">
            <div class="module-number">02</div>
            <h3 class="module-title">Advanced Data Modeling</h3>
            <ul class="module-topics">
              <li>Dataflow Optimization</li>
              <li>Advanced Recipes</li>
              <li>SAQL Fundamentals</li>
              <li>Predictive Modeling</li>
            </ul>
            <div class="module-duration">5 weeks</div>
          </div>

          <div class="module-card">
            <div class="module-number">03</div>
            <h3 class="module-title">Dashboard Mastery</h3>
            <ul class="module-topics">
              <li>Interactive Dashboard Design</li>
              <li>Advanced Chart Types</li>
              <li>Mobile Optimization</li>
              <li>Dashboard Performance</li>
            </ul>
            <div class="module-duration">4 weeks</div>
          </div>

          <div class="module-card">
            <div class="module-number">04</div>
            <h3 class="module-title">Real-world Projects</h3>
            <ul class="module-topics">
              <li>Sales Performance Analytics</li>
              <li>Customer Journey Analysis</li>
              <li>Marketing ROI Dashboard</li>
              <li>Service Analytics Implementation</li>
            </ul>
            <div class="module-duration">6 weeks</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta dark:bg-neutral-900">
      <div class="container">
        <div class="cta-content">
          <div class="stars-bg"></div>
          <div class="cta-text">
            <h2 class="cta-title">Ready to Master CRM Analytics?</h2>
            <p class="cta-description">
              Join thousands of professionals who have transformed their careers with our comprehensive CRM Analytics training program.
            </p>
            <div class="cta-links">
              <button class="btn btn-primary btn-lg">
                Enroll Now
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
              <button class="btn btn-neutral btn-outline btn-lg">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Download Syllabus
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Homepage',
  setup() {
    return {
      // Component logic here if needed
    }
  }
}
</script>

<style scoped>
.homepage {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Hero Section */
.hero {
  min-height: 90vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent 50%);
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 10;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #fff 0%, #a1a1aa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-primary {
  color: #3b82f6;
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #d4d4d8;
  margin-bottom: 2.5rem;
}

.hero-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  border: 1px solid transparent;
  cursor: pointer;
}

.btn-xl {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.btn-lg {
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
  transform: translateY(-2px);
}

.btn-neutral {
  background-color: #27272a;
  color: #fff;
}

.btn-outline {
  background-color: transparent;
  border-color: #52525b;
}

.btn-outline:hover {
  background-color: #3f3f46;
  border-color: #71717a;
}

/* Hero Media */
.video-container {
  aspect-ratio: 16/9;
  background: linear-gradient(145deg, #1f2937, #111827);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #374151;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.video-placeholder {
  text-align: center;
  color: #9ca3af;
}

/* Sections */
section {
  padding: 5rem 0;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
}

.section-description {
  font-size: 1.25rem;
  color: #a1a1aa;
  max-width: 600px;
  margin: 0 auto;
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: #18181b;
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid #27272a;
  transition: all 0.3s;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: #3b82f6;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.3);
}

.feature-icon {
  width: 4rem;
  height: 4rem;
  background: #1e40af;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  color: white;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: white;
}

.feature-description {
  color: #a1a1aa;
  line-height: 1.6;
}

/* Modules Grid */
.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.module-card {
  background: #18181b;
  padding: 2.5rem 2rem;
  border-radius: 1rem;
  border: 1px solid #27272a;
  position: relative;
  transition: all 0.3s;
}

.module-card:hover {
  transform: translateY(-4px);
  border-color: #3b82f6;
}

.module-number {
  position: absolute;
  top: -1rem;
  left: 2rem;
  background: #3b82f6;
  color: white;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.125rem;
}

.module-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: white;
}

.module-topics {
  list-style: none;
  padding: 0;
  margin-bottom: 2rem;
}

.module-topics li {
  color: #a1a1aa;
  padding: 0.5rem 0;
  border-bottom: 1px solid #27272a;
}

.module-topics li:last-child {
  border-bottom: none;
}

.module-duration {
  color: #3b82f6;
  font-weight: 600;
}

/* CTA Section */
.cta {
  position: relative;
  overflow: hidden;
}

.cta-content {
  background: #18181b;
  padding: 4rem;
  border-radius: 1rem;
  text-align: center;
  position: relative;
  border: 1px solid #27272a;
}

.stars-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.1), transparent 70%);
  opacity: 0.5;
}

.cta-text {
  position: relative;
  z-index: 10;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
}

.cta-description {
  font-size: 1.25rem;
  color: #a1a1aa;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-links {
    justify-content: center;
  }
  
  .features-grid,
  .modules-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-content {
    padding: 2rem;
  }
  
  .cta-title {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
}
</style>