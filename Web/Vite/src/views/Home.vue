<template>
  <div>
    <PageTransition />
    <HeroSection />

    <ContentSection id="knowledge" :title="t('knowledge.title')" variant="dark">
      <ModuleCard
        :title="t('knowledge.mod1.title')"
        :description="t('knowledge.mod1.desc')"
        image="/photos/p_waves.jpg"
        animation="tide-slide"
      />
      <ModuleCard
        :title="t('knowledge.mod2.title')"
        :description="t('knowledge.mod2.desc')"
        image="/photos/p_coral.jpg"
      />
      <ModuleCard
        :title="t('knowledge.mod3.title')"
        :description="t('knowledge.mod3.desc')"
        image="/photos/p_polution.jpg"
      />
    </ContentSection>

    <ContentSection id="academic" :title="t('academic.title')" variant="light">
      <div class="academic-grid">
        <ScrollReveal class="scholar-card">
          <img src="/photos/OIP.jpg" alt="David Attenborough" />
          <h3>{{ t('academic.scholar.title') }}</h3>
          <p>{{ t('academic.scholar.desc') }}</p>
          <a href="#" class="read-more">{{ t('academic.scholar.readMore') }}</a>
        </ScrollReveal>
        <ScrollReveal class="paper-list">
          <h3>{{ t('academic.papers.title') }}</h3>
          <ul>
            <li>
              <h4>{{ t('academic.papers.p1.title') }}</h4>
              <p>{{ t('academic.papers.p1.desc') }}</p>
            </li>
            <li>
              <h4>{{ t('academic.papers.p2.title') }}</h4>
              <p>{{ t('academic.papers.p2.desc') }}</p>
            </li>
          </ul>
        </ScrollReveal>
        <ScrollReveal class="official-links">
          <h3>{{ t('academic.links.title') }}</h3>
          <div class="link-buttons">
            <a href="https://ocean.si.edu/" target="_blank" class="btn">Smithsonian Ocean</a>
            <a href="https://www.noaa.gov/ocean" target="_blank" class="btn">NOAA Ocean</a>
            <a href="https://www.ipcc.ch/" target="_blank" class="btn">IPCC Data</a>
          </div>
        </ScrollReveal>
      </div>
    </ContentSection>

    <ContentSection id="interactive" :title="t('interactive.title')" variant="dark">
      <InteractiveUpload />
      
      <ScrollReveal class="weather-intro-container">
        <h2 class="weather-title">{{ t('interactive.weather.title') }}</h2>
        <div class="weather-text-layout">
          <p class="weather-text-left">{{ t('interactive.weather.desc1') }}</p>
          <div class="weather-text-right">
            <p class="weather-highlight-text">{{ t('interactive.weather.desc2') }}</p>
            <router-link to="/weather" class="btn weather-btn">
              {{ t('interactive.weather.btn') }}
            </router-link>
          </div>
        </div>
      </ScrollReveal>
      
      <ScrollReveal>
        <WeatherMap />
      </ScrollReveal>
    </ContentSection>

    <FooterSection />
  </div>
</template>

<script setup>
import { useI18n } from '../composables/useI18n.js'
import PageTransition from '../components/PageTransition.vue'
import HeroSection from '../components/HeroSection.vue'
import ContentSection from '../components/ContentSection.vue'
import ModuleCard from '../components/ModuleCard.vue'
import ScrollReveal from '../components/ScrollReveal.vue'
import InteractiveUpload from '../components/InteractiveUpload.vue'
import WeatherMap from './WeatherMap.vue'
import FooterSection from '../components/FooterSection.vue'

const { t } = useI18n()
</script>
