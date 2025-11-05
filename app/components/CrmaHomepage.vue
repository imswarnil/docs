<template>
    <div class="crma-homepage">
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
                <UButton
                  to="/curriculum"
                  size="xl"
                  trailing-icon="i-lucide-arrow-right"
                >
                  View Curriculum
                </UButton>
                <UButton
                  icon="i-lucide-play-circle"
                  color="neutral"
                  variant="outline"
                  size="xl"
                  to="https://yoursite.com/demo"
                  target="_blank"
                >
                  Watch Demo
                </UButton>
              </div>
            </div>
            <div class="hero-media">
              <div class="video-container">
                <iframe 
                  src="https://www.youtube-nocookie.com/embed/your-video-id" 
                  title="CRM Analytics Course Introduction" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerpolicy="strict-origin-when-cross-origin" 
                  allowfullscreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Features Section -->
      <section class="features dark:bg-neutral-950">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Why Choose Our CRM Analytics Training?</h2>
            <p class="section-description">
              Comprehensive learning experience designed for professionals at all levels
            </p>
          </div>
          <div class="features-grid">
            <div 
              v-for="feature in features" 
              :key="feature.title"
              class="feature-card"
            >
              <div class="feature-icon">
                <UIcon :name="feature.icon" class="w-8 h-8" />
              </div>
              <h3 class="feature-title">{{ feature.title }}</h3>
              <p class="feature-description">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Curriculum Section -->
      <section class="curriculum dark:bg-neutral-900">
        <div class="container">
          <div class="section-header">
            <h2 class="section-title">Course Curriculum Overview</h2>
            <p class="section-description">
              Structured learning path from fundamentals to advanced CRM Analytics concepts
            </p>
          </div>
          <div class="curriculum-grid">
            <div 
              v-for="module in curriculum" 
              :key="module.title"
              class="module-card"
            >
              <div class="module-number">{{ module.number }}</div>
              <h3 class="module-title">{{ module.title }}</h3>
              <ul class="module-topics">
                <li v-for="topic in module.topics" :key="topic">{{ topic }}</li>
              </ul>
              <div class="module-duration">{{ module.duration }}</div>
            </div>
          </div>
        </div>
      </section>
  
      <!-- CTA Section -->
      <section class="cta dark:bg-gradient-to-b from-neutral-950 to-neutral-900">
        <div class="cta-container">
          <div class="stars-bg"></div>
          <div class="cta-content">
            <h2 class="cta-title">Ready to Master CRM Analytics?</h2>
            <p class="cta-description">
              Join thousands of professionals who have transformed their careers with our comprehensive CRM Analytics training program.
            </p>
            <div class="cta-links">
              <UButton
                to="/enrollment"
                size="lg"
                trailing-icon="i-lucide-arrow-right"
              >
                Enroll Now
              </UButton>
              <UButton
                icon="i-lucide-download"
                color="neutral"
                variant="outline"
                size="lg"
                to="/syllabus"
                target="_blank"
              >
                Download Syllabus
              </UButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script setup lang="ts">
  // Features data
  const features = [
    {
      icon: 'i-lucide-award',
      title: 'Industry Certified Instructors',
      description: 'Learn from Salesforce-certified professionals with real-world experience in CRM Analytics implementation.'
    },
    {
      icon: 'i-lucide-briefcase',
      title: 'Hands-on Projects',
      description: 'Work with real datasets and build portfolio projects that demonstrate your CRM Analytics expertise.'
    },
    {
      icon: 'i-lucide-graduation-cap',
      title: 'Comprehensive Curriculum',
      description: 'From data preparation to advanced dashboard creation - master the complete CRM Analytics workflow.'
    },
    {
      icon: 'i-lucide-users',
      title: 'Community Support',
      description: 'Join our exclusive community of CRM Analytics professionals for networking and continuous learning.'
    },
    {
      icon: 'i-lucide-clock',
      title: 'Self-Paced Learning',
      description: 'Learn at your own pace with lifetime access to course materials and all future updates.'
    },
    {
      icon: 'i-lucide-trending-up',
      title: 'Career Advancement',
      description: 'Get personalized career guidance and interview preparation for CRM Analytics roles.'
    }
  ]
  
  // Curriculum data
  const curriculum = [
    {
      number: '01',
      title: 'CRM Analytics Fundamentals',
      topics: [
        'Introduction to CRM Analytics',
        'Data Preparation & Recipes',
        'Lens & Dashboard Basics',
        'Data Security & Governance'
      ],
      duration: '4 weeks'
    },
    {
      number: '02',
      title: 'Advanced Data Modeling',
      topics: [
        'Dataflow Optimization',
        'Advanced Recipes & SAQL',
        'Predictive Modeling',
        'Machine Learning Integration'
      ],
      duration: '5 weeks'
    },
    {
      number: '03',
      title: 'Dashboard Mastery',
      topics: [
        'Interactive Dashboard Design',
        'Advanced Chart Types',
        'Mobile Optimization',
        'Performance Tuning'
      ],
      duration: '4 weeks'
    },
    {
      number: '04',
      title: 'Real-world Projects',
      topics: [
        'Sales Performance Analytics',
        'Customer Journey Analysis',
        'Marketing ROI Dashboard',
        'Service Analytics Implementation'
      ],
      duration: '6 weeks'
    }
  ]
  </script>
  
  <style scoped>
  .crma-homepage {
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
  }
  
  /* Container */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .cta-container {
    max-width: 800px;
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
  
  /* Hero Media */
  .video-container {
    aspect-ratio: 16/9;
    border-radius: 1rem;
    overflow: hidden;
    border: 1px solid #374151;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }
  
  .video-container iframe {
    width: 100%;
    height: 100%;
    border: none;
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
  
  /* Curriculum Grid */
  .curriculum-grid {
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
    position: relative;
    padding-left: 1rem;
  }
  
  .module-topics li:before {
    content: "•";
    color: #3b82f6;
    position: absolute;
    left: 0;
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
      gap: 2rem;
    }
    
    .hero-title {
      font-size: 2.5rem;
    }
    
    .hero-links {
      justify-content: center;
    }
    
    .features-grid,
    .curriculum-grid {
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
    
    section {
      padding: 3rem 0;
    }
  }
  </style>