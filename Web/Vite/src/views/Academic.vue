<template>
  <div>
    <PageTransition />
    <div class="academic-page-spacer"></div>
    <section class="section-dark" style="padding-top: 4rem; padding-bottom: 6rem; min-height: 100vh;">
      <h1 class="section-title visible" style="font-size: 3rem; margin-bottom: 4rem;">
        {{ t('page.academic.header') }}
      </h1>
      <div class="academic-container">
        <!-- 文献部分 -->
        <div style="margin-bottom: 5rem;" class="tide-slide visible">
          <h3 style="font-size: 2rem; border-bottom: 1px solid var(--accent); padding-bottom: 10px; margin-bottom: 2rem; color: var(--title-color);">
            {{ t('page.academic.section1.title') }}
          </h3>
          <div class="paper-card-large">
            <h4>{{ t('page.academic.paper1.title') }}</h4>
            <p>{{ t('page.academic.paper1.desc') }}</p>
            <div class="author">{{ t('page.academic.paper1.author') }}</div>
          </div>
          <div class="paper-card-large">
            <h4>{{ t('page.academic.paper2.title') }}</h4>
            <p>{{ t('page.academic.paper2.desc') }}</p>
            <div class="author">{{ t('page.academic.paper2.author') }}</div>
          </div>
          <div class="paper-card-large">
            <h4>{{ t('page.academic.paper3.title') }}</h4>
            <p>{{ t('page.academic.paper3.desc') }}</p>
            <div class="author">{{ t('page.academic.paper3.author') }}</div>
          </div>
        </div>

        <!-- 学者部分 -->
        <div style="margin-bottom: 5rem;" class="tide-slide visible">
          <h3 style="font-size: 2rem; border-bottom: 1px solid var(--accent); padding-bottom: 10px; margin-bottom: 2rem; color: var(--title-color);">
            {{ t('page.academic.section2.title') }}
          </h3>
          <div style="display: flex; align-items: center; gap: 2rem; text-align: left; padding: 2rem; border-radius: 12px; background: var(--bg-overlay); flex-wrap: wrap;">
            <img src="/photos/OIP.jpg" alt="Scholar Portrait" style="width: 200px; height: 250px; border-radius: 8px; object-fit: cover;" />
            <div style="flex: 1;">
              <h3 style="font-size: 1.8rem; margin-bottom: 1rem; color: var(--highlight);">
                {{ t('page.academic.scholar.name') }}
              </h3>
              <p style="font-size: 1.1rem; line-height: 1.8; color: var(--text-primary); text-align: justify;">
                {{ t('page.academic.scholar.desc') }}
              </p>
            </div>
          </div>
        </div>

        <!-- 传送门部分 -->
        <div class="tide-slide visible">
          <h3 style="font-size: 2rem; border-bottom: 1px solid var(--accent); padding-bottom: 10px; margin-bottom: 2rem; color: var(--title-color);">
            {{ t('page.academic.section3.title') }}
          </h3>
          <div class="portal-links">
            <a href="https://www.noaa.gov/" target="_blank" class="portal-btn">{{ t('page.academic.link1') }}</a>
            <a href="https://www.ipcc.ch/" target="_blank" class="portal-btn">{{ t('page.academic.link2') }}</a>
            <a href="https://www.marinespecies.org/" target="_blank" class="portal-btn">{{ t('page.academic.link3') }}</a>
            <a href="https://www.iucnredlist.org/" target="_blank" class="portal-btn">{{ t('page.academic.link4') }}</a>
          </div>
        </div>
      </div>
    </section>
    <FooterSection />
  </div>
</template>

<script setup>
import { useI18n } from '../composables/useI18n.js'
import PageTransition from '../components/PageTransition.vue'
import FooterSection from '../components/FooterSection.vue'

const { t } = useI18n()
</script>
